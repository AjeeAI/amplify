from datetime import datetime, timezone, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user, get_current_user_optional
from config import settings

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

@router.get("", response_model=List[schemas.CampaignOut])
def list_campaigns(
    category: Optional[models.CampaignCategory] = None,
    status_filter: Optional[models.CampaignStatus] = Query(None, alias="status"),
    sort_by: Optional[str] = Query("popular", enum=["popular", "newest", "funded_desc"]),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    List campaigns for Home and Explore feeds with filtering and sorting.
    Defaults to ACTIVE and PROMOTING campaigns.
    """
    query = db.query(models.Campaign)

    if status_filter:
        query = query.filter(models.Campaign.status == status_filter)
    else:
        # Default public feed shows ACTIVE and PROMOTING
        query = query.filter(models.Campaign.status.in_([models.CampaignStatus.ACTIVE, models.CampaignStatus.PROMOTING]))

    if category:
        query = query.filter(models.Campaign.category == category)

    if sort_by == "newest":
        query = query.order_by(models.Campaign.created_at.desc())
    elif sort_by == "funded_desc":
        query = query.order_by(models.Campaign.amount_raised.desc())
    else:
        # Popular: highest amount raised first
        query = query.order_by(models.Campaign.amount_raised.desc())

    campaigns = query.offset(skip).limit(limit).all()
    return campaigns

@router.get("/{id}", response_model=schemas.CampaignOut)
def get_campaign(id: str, db: Session = Depends(get_db)):
    """Retrieve full editorial details, creator info, and status of a specific campaign."""
    campaign = db.query(models.Campaign).filter(models.Campaign.id == id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return campaign

@router.post("", response_model=schemas.CampaignOut, status_code=status.HTTP_201_CREATED)
def create_campaign_draft(
    campaign_in: schemas.CampaignCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Step 1 Basics: Creates a campaign in DRAFT state."""
    estimated_reach = round(campaign_in.funding_goal * settings.REACH_MULTIPLIER)

    campaign = models.Campaign(
        creator_id=current_user.id,
        title=campaign_in.title,
        category=campaign_in.category,
        summary=campaign_in.summary,
        funding_goal=campaign_in.funding_goal,
        story_content=campaign_in.story_content,
        target_radius_miles=campaign_in.target_radius_miles,
        cover_image=campaign_in.cover_image or "https://images.unsplash.com/photo-1544333323-5374ac40d938?w=800&auto=format&fit=crop&q=80",
        status=models.CampaignStatus.DRAFT,
        estimated_total_reach=estimated_reach,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign

@router.put("/{id}", response_model=schemas.CampaignOut)
def update_campaign_draft(
    id: str,
    campaign_update: schemas.CampaignUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates draft steps (Story, Visuals, Reach targets)."""
    campaign = db.query(models.Campaign).filter(models.Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    if campaign.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this campaign")

    update_data = campaign_update.dict(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(campaign, field, val)

    if campaign_update.funding_goal:
        campaign.estimated_total_reach = round(campaign.funding_goal * settings.REACH_MULTIPLIER)

    db.commit()
    db.refresh(campaign)
    return campaign

@router.post("/{id}/submit", response_model=schemas.CampaignOut)
def submit_campaign(
    id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits a campaign for launch.
    Transitions from DRAFT -> REVIEW_PENDING -> ACTIVE (simulating approved audit review for MVP).
    """
    campaign = db.query(models.Campaign).filter(models.Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    if campaign.creator_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to submit this campaign")

    # Move to ACTIVE
    campaign.status = models.CampaignStatus.ACTIVE
    db.commit()
    db.refresh(campaign)

    # Add activity
    activity = models.Activity(
        user_id=current_user.id,
        activity_type=models.ActivityType.MILESTONE,
        message=f"Campaign '{campaign.title}' passed 3-stage audit review and is now live in civic broadcast networks."
    )
    db.add(activity)
    db.commit()

    return campaign

@router.post("/{id}/contribute", response_model=schemas.SuccessBlastResponse)
def contribute_to_campaign(
    id: str,
    contribution_in: schemas.ContributionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simulates payment gateway, increments campaign amount_raised,
    computes exact reach ($1 = 27 impressions), updates impact streak gamification,
    and returns Success Blast telemetry.
    """
    campaign = db.query(models.Campaign).filter(models.Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    amount = contribution_in.amount
    impressions = round(amount * settings.REACH_MULTIPLIER)

    # 1. Record contribution
    contribution = models.Contribution(
        campaign_id=campaign.id,
        backer_id=current_user.id,
        amount=amount,
        impressions_generated=impressions,
        payment_status=models.PaymentStatus.SUCCESS,
    )
    db.add(contribution)

    # 2. Update campaign amount_raised
    campaign.amount_raised += amount
    if campaign.amount_raised >= campaign.funding_goal and campaign.status == models.CampaignStatus.ACTIVE:
        campaign.status = models.CampaignStatus.PROMOTING

    # 3. Streak Gamification Logic
    now = datetime.now(timezone.utc)
    last_contrib = current_user.last_contribution_at

    if last_contrib:
        # Check time difference in hours
        hours_diff = (now - last_contrib.replace(tzinfo=timezone.utc if last_contrib.tzinfo is None else None)).total_seconds() / 3600.0
        if 20.0 <= hours_diff <= 48.0:
            current_user.streak_count += 1
        elif hours_diff > 48.0:
            current_user.streak_count = 1
        # If < 20 hours (same day), maintain streak
    else:
        current_user.streak_count = 1

    current_user.last_contribution_at = now

    # 4. Create Activity Entry for Ripple Feed
    activity = models.Activity(
        user_id=current_user.id,
        activity_type=models.ActivityType.AMPLIFICATION,
        message=f"Your ${amount:.0f} contribution to '{campaign.title}' mobilized ~{impressions:,} citizens within a {campaign.target_radius_miles}-mile radius."
    )
    db.add(activity)

    db.commit()
    db.refresh(contribution)
    db.refresh(campaign)
    db.refresh(current_user)

    contrib_out = schemas.ContributionOut(
        id=contribution.id,
        campaign_id=contribution.campaign_id,
        backer_id=contribution.backer_id,
        amount=contribution.amount,
        impressions_generated=contribution.impressions_generated,
        payment_status=contribution.payment_status,
        created_at=contribution.created_at,
        campaign_title=campaign.title,
    )

    return schemas.SuccessBlastResponse(
        message="Amplification Blast Queued Successfully!",
        contribution=contrib_out,
        telemetry_status="Injecting Ads (82%)",
        estimated_broadcast_time="4m 12s",
        radius_miles=campaign.target_radius_miles,
        new_amount_raised=campaign.amount_raised,
        campaign_status=campaign.status,
        new_user_streak=current_user.streak_count
    )
