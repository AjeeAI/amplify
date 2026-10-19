from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from models import CampaignCategory, CampaignStatus, PaymentStatus, ActivityType

# Auth Schemas
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: str
    full_name: str
    email: str
    streak_count: int
    created_at: datetime

    class Config:
        from_attributes = True

# Campaign Schemas
class CampaignBase(BaseModel):
    title: str = Field(..., max_length=100)
    category: CampaignCategory = CampaignCategory.CLIMATE
    summary: str
    funding_goal: float = Field(..., gt=0)
    story_content: Optional[str] = None
    target_radius_miles: int = 5
    cover_image: Optional[str] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[CampaignCategory] = None
    summary: Optional[str] = None
    funding_goal: Optional[float] = None
    story_content: Optional[str] = None
    target_radius_miles: Optional[int] = None
    cover_image: Optional[str] = None

class CampaignOut(CampaignBase):
    id: str
    creator_id: str
    amount_raised: float
    status: CampaignStatus
    estimated_total_reach: int
    created_at: datetime
    creator: Optional[UserOut] = None

    class Config:
        from_attributes = True

# Reach Calculator Schemas
class ReachCalculation(BaseModel):
    amount: float
    estimated_impressions: int
    multiplier: int = 27
    devices_estimate: int
    radius_estimate: str

# Contribution Schemas
class ContributionCreate(BaseModel):
    amount: float = Field(..., gt=0)
    payment_method: str = "apple_pay"

class ContributionOut(BaseModel):
    id: str
    campaign_id: str
    backer_id: str
    amount: float
    impressions_generated: int
    payment_status: PaymentStatus
    created_at: datetime
    campaign_title: Optional[str] = None

    class Config:
        from_attributes = True

class SuccessBlastResponse(BaseModel):
    message: str
    contribution: ContributionOut
    telemetry_status: str
    estimated_broadcast_time: str
    radius_miles: int
    new_amount_raised: float
    campaign_status: CampaignStatus
    new_user_streak: int

# Activity Schemas
class ActivityOut(BaseModel):
    id: str
    user_id: str
    activity_type: ActivityType
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardOut(BaseModel):
    user: UserOut
    streak_count: int
    total_donated: float
    total_impressions_achieved: int
    backed_campaigns: List[CampaignOut]
    my_campaigns: List[CampaignOut]

# AI Voice Draft Schemas
class VoiceDraftRequest(BaseModel):
    transcript_text: Optional[str] = None

class VoiceDraftResponse(BaseModel):
    title: str
    category: CampaignCategory
    summary: str
    story_content: str
    funding_goal: float
    target_radius_miles: int
    target_impressions: int

# Phase 2: Broadcast & Telemetry Schemas
class BroadcastDeployRequest(BaseModel):
    campaign_id: str
    budget_amount: float = Field(..., gt=0)
    network_types: Optional[List[str]] = Field(default=["Meta", "Instagram", "Digital Billboards"])
    target_radius_miles: Optional[int] = 5
    contribution_id: Optional[str] = None

class BroadcastTelemetryOut(BaseModel):
    deployment_id: str
    campaign_id: str
    campaign_title: str
    status: str
    budget_amount: float
    target_impressions: int
    impressions_delivered: int
    delivery_percent: float
    active_networks: List[str]
    meta_campaign_id: str
    google_campaign_id: str
    target_radius_miles: int
    recent_hotspots: List[dict]
    estimated_remaining_seconds: int

class WebhookAdTelemetry(BaseModel):
    ad_id: str
    campaign_id: str
    network: str = "Meta"
    new_impressions: int
    clicks_count: int = 0
    spend: float = 0.0

class DeviceRegisterRequest(BaseModel):
    push_token: str
    platform: str = "expo"

class InAppNotificationOut(BaseModel):
    id: str
    title: str
    message: str
    notification_type: str
    campaign_id: Optional[str] = None
    created_at: datetime
    read: bool = False

# Phase 3: Enterprise Matching & Verifiable Ledger Schemas
class MatchingPoolOut(BaseModel):
    id: str
    sponsor_name: str
    sponsor_logo: Optional[str] = None
    match_multiplier: float
    total_pool_amount: float
    remaining_amount: float
    eligible_category: str
    active: bool

    class Config:
        from_attributes = True

class ApplyMatchRequest(BaseModel):
    campaign_id: str
    pledge_amount: float = Field(..., gt=0)

class ApplyMatchResponse(BaseModel):
    sponsor_name: str
    user_amount: float
    match_amount: float
    total_amplified: float
    total_impressions: int
    matched_impressions: int
    multiplier_label: str

class LedgerBlockOut(BaseModel):
    id: str
    block_index: int
    campaign_id: str
    contribution_id: Optional[str] = None
    data_hash: str
    previous_hash: str
    merkle_root: str
    impressions_verified: int
    proof_signature: str
    created_at: datetime

    class Config:
        from_attributes = True
