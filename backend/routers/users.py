from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["Profile & Activity"])

@router.get("/me/dashboard", response_model=schemas.DashboardOut)
def get_user_dashboard(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns user profile, current streak_count, total dollars amplified,
    cumulative impressions achieved, list of backed campaigns, and list of my created campaigns.
    """
    # Total donated & impressions
    total_stats = (
        db.query(
            func.coalesce(func.sum(models.Contribution.amount), 0.0),
            func.coalesce(func.sum(models.Contribution.impressions_generated), 0)
        )
        .filter(models.Contribution.backer_id == current_user.id)
        .first()
    )
    total_donated = float(total_stats[0])
    total_impressions = int(total_stats[1])

    # Distinct backed campaigns
    backed_campaign_ids = (
        db.query(models.Contribution.campaign_id)
        .filter(models.Contribution.backer_id == current_user.id)
        .distinct()
        .all()
    )
    backed_ids = [c[0] for c in backed_campaign_ids]
    backed_campaigns = (
        db.query(models.Campaign)
        .filter(models.Campaign.id.in_(backed_ids))
        .all()
    ) if backed_ids else []

    # Created campaigns
    my_campaigns = (
        db.query(models.Campaign)
        .filter(models.Campaign.creator_id == current_user.id)
        .all()
    )

    return schemas.DashboardOut(
        user=current_user,
        streak_count=current_user.streak_count,
        total_donated=total_donated,
        total_impressions_achieved=total_impressions,
        backed_campaigns=backed_campaigns,
        my_campaigns=my_campaigns
    )

@router.get("/me/activity", response_model=List[schemas.ActivityOut])
def get_user_activity(
    skip: int = 0,
    limit: int = 20,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Paginated list of recent notifications, ripple broadcasts, and match alerts."""
    activities = (
        db.query(models.Activity)
        .filter(models.Activity.user_id == current_user.id)
        .order_by(models.Activity.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return activities
