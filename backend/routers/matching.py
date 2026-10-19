import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from config import settings

router = APIRouter(prefix="/matching-pools", tags=["Phase 3: Corporate CSR Matching Pools"])

DEFAULT_MATCHING_POOLS = [
    {
        "id": "pool-patagonia",
        "sponsor_name": "Patagonia 1% For The Planet",
        "sponsor_logo": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&auto=format&fit=crop&q=80",
        "match_multiplier": 1.0,  # 1:1 match = doubles pledge
        "total_pool_amount": 100000.0,
        "remaining_amount": 78400.0,
        "eligible_category": "Climate",
    },
    {
        "id": "pool-google-org",
        "sponsor_name": "Google.org Civic Tech Fund",
        "sponsor_logo": "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80",
        "match_multiplier": 1.0,
        "total_pool_amount": 250000.0,
        "remaining_amount": 214500.0,
        "eligible_category": "Tech & Society",
    },
    {
        "id": "pool-ford",
        "sponsor_name": "Ford Foundation Grassroots",
        "sponsor_logo": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80",
        "match_multiplier": 1.0,
        "total_pool_amount": 500000.0,
        "remaining_amount": 420000.0,
        "eligible_category": "All",
    },
]

def ensure_matching_pools_seeded(db: Session):
    if not db.query(models.MatchingPool).first():
        for p in DEFAULT_MATCHING_POOLS:
            pool = models.MatchingPool(
                id=p["id"],
                sponsor_name=p["sponsor_name"],
                sponsor_logo=p["sponsor_logo"],
                match_multiplier=p["match_multiplier"],
                total_pool_amount=p["total_pool_amount"],
                remaining_amount=p["remaining_amount"],
                eligible_category=p["eligible_category"],
                active=1,
            )
            db.add(pool)
        db.commit()

@router.get("", response_model=List[schemas.MatchingPoolOut])
def get_matching_pools(db: Session = Depends(get_db)):
    """Returns active corporate CSR matching pools available for campaigns."""
    ensure_matching_pools_seeded(db)
    pools = db.query(models.MatchingPool).filter(models.MatchingPool.active == 1).all()
    return pools

@router.post("/apply-match", response_model=schemas.ApplyMatchResponse)
def apply_corporate_match(
    payload: schemas.ApplyMatchRequest,
    db: Session = Depends(get_db)
):
    """
    Applies matching corporate grant multiplier to a user contribution.
    Example: $25 user pledge + $25 Patagonia match = $50 total (1,350 impressions).
    """
    ensure_matching_pools_seeded(db)
    campaign = db.query(models.Campaign).filter(models.Campaign.id == payload.campaign_id).first()
    category = campaign.category.value if campaign else "Climate"

    # Find matching pool for category or "All"
    pool = (
        db.query(models.MatchingPool)
        .filter(models.MatchingPool.eligible_category.in_([category, "All"]))
        .first()
    )
    if not pool:
        pool = db.query(models.MatchingPool).first()

    multiplier = pool.match_multiplier if pool else 1.0
    sponsor_name = pool.sponsor_name if pool else "Amplify Civic Match"

    match_amount = round(payload.pledge_amount * multiplier, 2)
    total_amplified = round(payload.pledge_amount + match_amount, 2)
    total_impressions = int(total_amplified * settings.REACH_MULTIPLIER)
    matched_impressions = int(match_amount * settings.REACH_MULTIPLIER)

    # Deduct from pool if available
    if pool and pool.remaining_amount >= match_amount:
        pool.remaining_amount -= match_amount
        db.commit()

    return schemas.ApplyMatchResponse(
        sponsor_name=sponsor_name,
        user_amount=payload.pledge_amount,
        match_amount=match_amount,
        total_amplified=total_amplified,
        total_impressions=total_impressions,
        matched_impressions=matched_impressions,
        multiplier_label=f"{int(multiplier + 1)}x Match Activated",
    )
