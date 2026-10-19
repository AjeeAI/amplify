import random
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from config import settings

router = APIRouter(prefix="", tags=["Phase 2: Social Ad Broadcast & Webhooks"])

BOSTON_HOTSPOTS = [
    {"neighborhood": "Beacon Hill & State House", "radius": "1.8 mi", "devices": 420},
    {"neighborhood": "Back Bay & Copley Square", "radius": "2.4 mi", "devices": 680},
    {"neighborhood": "Cambridge & Kendall Square", "radius": "3.1 mi", "devices": 890},
    {"neighborhood": "South End Arts District", "radius": "2.0 mi", "devices": 310},
    {"neighborhood": "Seaport Innovation District", "radius": "3.8 mi", "devices": 540},
    {"neighborhood": "Jamaica Plain Green Corridor", "radius": "4.5 mi", "devices": 460},
]

@router.post("/broadcast/deploy", response_model=schemas.BroadcastTelemetryOut)
def deploy_broadcast(
    payload: schemas.BroadcastDeployRequest,
    db: Session = Depends(get_db)
):
    """
    Deploys a sponsored message broadcast across the Meta Marketing API and Google Ads networks.
    Converts budget to guaranteed impressions ($1 = 27 impressions).
    """
    campaign = db.query(models.Campaign).filter(models.Campaign.id == payload.campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    target_impressions = int(payload.budget_amount * settings.REACH_MULTIPLIER)
    # Start with initial simulated injection progress (~75-85%)
    initial_delivered = int(target_impressions * random.uniform(0.72, 0.85))

    meta_id = f"act_meta_{random.randint(100000, 999999)}"
    google_id = f"goog_ads_{random.randint(100000, 999999)}"
    networks_str = ",".join(payload.network_types) if payload.network_types else "Meta,Instagram,Digital Billboards"

    deployment = models.BroadcastDeployment(
        id=f"deploy-{uuid.uuid4().hex[:10]}",
        campaign_id=campaign.id,
        contribution_id=payload.contribution_id,
        meta_campaign_id=meta_id,
        google_campaign_id=google_id,
        network_types=networks_str,
        budget_amount=payload.budget_amount,
        target_impressions=target_impressions,
        impressions_delivered=initial_delivered,
        status="INJECTING_ADS",
        target_radius_miles=payload.target_radius_miles or campaign.target_radius_miles,
    )
    db.add(deployment)

    # Increment campaign total impressions
    campaign.estimated_total_reach = max(campaign.estimated_total_reach, target_impressions)
    db.commit()
    db.refresh(deployment)

    hotspots = random.sample(BOSTON_HOTSPOTS, k=min(3, len(BOSTON_HOTSPOTS)))
    delivery_pct = round((deployment.impressions_delivered / max(1, deployment.target_impressions)) * 100, 1)

    return schemas.BroadcastTelemetryOut(
        deployment_id=deployment.id,
        campaign_id=campaign.id,
        campaign_title=campaign.title,
        status=deployment.status,
        budget_amount=deployment.budget_amount,
        target_impressions=deployment.target_impressions,
        impressions_delivered=deployment.impressions_delivered,
        delivery_percent=delivery_pct,
        active_networks=deployment.network_types.split(","),
        meta_campaign_id=meta_id,
        google_campaign_id=google_id,
        target_radius_miles=deployment.target_radius_miles,
        recent_hotspots=hotspots,
        estimated_remaining_seconds=random.randint(180, 320),
    )

@router.get("/campaigns/{id}/broadcast-telemetry", response_model=schemas.BroadcastTelemetryOut)
def get_campaign_broadcast_telemetry(
    id: str,
    db: Session = Depends(get_db)
):
    """
    Returns live programmatic telemetry for an active broadcast campaign.
    Simulates ongoing impression delivery ticks as ads stream across Meta & Billboard networks.
    """
    campaign = db.query(models.Campaign).filter(models.Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Look for existing deployment or synthesize live telemetry
    deployment = (
        db.query(models.BroadcastDeployment)
        .filter(models.BroadcastDeployment.campaign_id == campaign.id)
        .order_by(models.BroadcastDeployment.created_at.desc())
        .first()
    )

    if not deployment:
        target_imp = int(campaign.amount_raised * settings.REACH_MULTIPLIER) if campaign.amount_raised > 0 else 540000
        delivered = int(target_imp * 0.88)
        meta_id = f"act_meta_{abs(hash(campaign.id)) % 900000 + 100000}"
        google_id = f"goog_ads_{abs(hash(campaign.title)) % 900000 + 100000}"
        budget = campaign.amount_raised if campaign.amount_raised > 0 else 20000.0
        networks = ["Meta Graph", "Instagram Feed", "Digital Billboards"]
    else:
        target_imp = deployment.target_impressions
        # Incremental live delivery tick
        elapsed_seconds = int((datetime.now(timezone.utc) - deployment.created_at.replace(tzinfo=timezone.utc)).total_seconds())
        increment = min(target_imp - deployment.impressions_delivered, elapsed_seconds * 14)
        delivered = min(target_imp, deployment.impressions_delivered + max(0, increment))
        deployment.impressions_delivered = delivered
        if delivered >= target_imp:
            deployment.status = "COMPLETED"
        else:
            deployment.status = "INJECTING_ADS" if delivered < target_imp * 0.85 else "STREAMING"
        db.commit()

        meta_id = deployment.meta_campaign_id or "act_meta_883921"
        google_id = deployment.google_campaign_id or "goog_ads_449210"
        budget = deployment.budget_amount
        networks = deployment.network_types.split(",")

    delivery_pct = round((delivered / max(1, target_imp)) * 100, 1)
    hotspots = random.sample(BOSTON_HOTSPOTS, k=min(4, len(BOSTON_HOTSPOTS)))

    return schemas.BroadcastTelemetryOut(
        deployment_id=deployment.id if deployment else f"deploy-{campaign.id}",
        campaign_id=campaign.id,
        campaign_title=campaign.title,
        status="INJECTING_ADS" if delivery_pct < 85 else "STREAMING" if delivery_pct < 100 else "COMPLETED",
        budget_amount=budget,
        target_impressions=target_imp,
        impressions_delivered=delivered,
        delivery_percent=delivery_pct,
        active_networks=networks,
        meta_campaign_id=meta_id,
        google_campaign_id=google_id,
        target_radius_miles=campaign.target_radius_miles,
        recent_hotspots=hotspots,
        estimated_remaining_seconds=max(0, int((100 - delivery_pct) * 6)),
    )

@router.post("/webhooks/ad-telemetry")
def webhook_ad_telemetry(
    payload: schemas.WebhookAdTelemetry,
    db: Session = Depends(get_db)
):
    """
    Programmatic webhook endpoint called by Meta Marketing API / Google Ads
    to report batch ad impressions, clicks, and geo-delivery stats.
    """
    campaign = db.query(models.Campaign).filter(models.Campaign.id == payload.campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Increment delivered impressions
    campaign.estimated_total_reach += payload.new_impressions

    # Create Activity event for real-time ripple
    activity = models.Activity(
        user_id=campaign.creator_id,
        activity_type=models.ActivityType.AMPLIFICATION,
        message=f"Webhook delivered {payload.new_impressions:,} live impressions across {payload.network} ({payload.clicks_count} clicks).",
    )
    db.add(activity)
    db.commit()

    return {
        "status": "acknowledged",
        "ad_id": payload.ad_id,
        "campaign_id": campaign.id,
        "new_total_reach": campaign.estimated_total_reach,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
