import random
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Phase 2: Push & In-App Notifications"])

MOCK_NOTIFICATION_TEMPLATES = [
    {
        "title": "🎉 Ripple Milestone Achieved!",
        "message": "Your $25 micro-pledge just crossed 675 verified local impressions in Boston Metro.",
        "type": "MILESTONE",
    },
    {
        "title": "⚡ 2x Corporate Match Active!",
        "message": "Patagonia Civic Fund matched your Clean Rivers contribution dollar-for-dollar.",
        "type": "MATCH_BONUS",
    },
    {
        "title": "🔥 3-Day Streak Maintained!",
        "message": "You're on day 3 of your Amplification Streak. Daily impact reward unlocked.",
        "type": "STREAK",
    },
    {
        "title": "📡 Ad Network Telemetry Live",
        "message": "Sponsored message batch reached 420 mobile devices along Beacon Hill.",
        "type": "BROADCAST",
    },
]

@router.post("/register-device")
def register_device_token(
    payload: schemas.DeviceRegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Registers an Expo Push Token or APNS/FCM device token for real-time notifications.
    """
    existing = db.query(models.DeviceToken).filter(models.DeviceToken.token == payload.push_token).first()
    if not existing:
        token_entry = models.DeviceToken(
            token=payload.push_token,
            platform=payload.platform,
        )
        db.add(token_entry)
        db.commit()

    return {
        "status": "registered",
        "push_token": payload.push_token,
        "platform": payload.platform,
        "registered_at": datetime.now(timezone.utc).isoformat(),
    }

@router.get("/stream", response_model=List[schemas.InAppNotificationOut])
def get_notification_stream(
    db: Session = Depends(get_db)
):
    """
    Returns real-time in-app notification stream with milestone triggers and match bonuses.
    """
    notifications = []
    now = datetime.now(timezone.utc)
    for idx, template in enumerate(MOCK_NOTIFICATION_TEMPLATES):
        notifications.append(
            schemas.InAppNotificationOut(
                id=f"notif-{idx + 1}",
                title=template["title"],
                message=template["message"],
                notification_type=template["type"],
                campaign_id="camp-1",
                created_at=now,
                read=(idx > 1),
            )
        )
    return notifications

@router.post("/trigger-test")
def trigger_test_notification(
    title: str = "Live Civic Alert",
    message: str = "Ad delivery verified across 840 devices in Boston.",
    db: Session = Depends(get_db)
):
    """
    Triggers an immediate simulated push notification payload.
    """
    return {
        "status": "dispatched",
        "title": title,
        "message": message,
        "sent_to_devices": 1,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
