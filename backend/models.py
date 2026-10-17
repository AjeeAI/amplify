import uuid
from datetime import datetime, timezone
import enum
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Text,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from database import Base

class CampaignCategory(str, enum.Enum):
    CLIMATE = "Climate"
    TECH_SOCIETY = "Tech & Society"
    EDUCATION = "Education"
    CIVIC_TECH = "Civic Tech"
    CLEAN_ENERGY = "Clean Energy"

class CampaignStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    REVIEW_PENDING = "REVIEW_PENDING"
    ACTIVE = "ACTIVE"
    PROMOTING = "PROMOTING"
    COMPLETED = "COMPLETED"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"

class ActivityType(str, enum.Enum):
    CONTRIBUTION_MATCH = "CONTRIBUTION_MATCH"
    MILESTONE = "MILESTONE"
    STREAK_UPDATE = "STREAK_UPDATE"
    AMPLIFICATION = "AMPLIFICATION"

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    streak_count = Column(Integer, default=0)
    last_contribution_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    campaigns = relationship("Campaign", back_populates="creator")
    contributions = relationship("Contribution", back_populates="backer")
    activities = relationship("Activity", back_populates="user")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    creator_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)
    category = Column(SQLEnum(CampaignCategory), default=CampaignCategory.CLIMATE, nullable=False)
    summary = Column(Text, nullable=False)
    story_content = Column(Text, nullable=True)
    funding_goal = Column(Float, nullable=False)
    amount_raised = Column(Float, default=0.0)
    status = Column(SQLEnum(CampaignStatus), default=CampaignStatus.DRAFT, nullable=False)
    target_radius_miles = Column(Integer, default=5)
    estimated_total_reach = Column(Integer, default=0)
    cover_image = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    creator = relationship("User", back_populates="campaigns")
    contributions = relationship("Contribution", back_populates="campaign")

class Contribution(Base):
    __tablename__ = "contributions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    campaign_id = Column(String(36), ForeignKey("campaigns.id"), nullable=False)
    backer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    impressions_generated = Column(Integer, nullable=False)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.SUCCESS, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)

    campaign = relationship("Campaign", back_populates="contributions")
    backer = relationship("User", back_populates="contributions")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    activity_type = Column(SQLEnum(ActivityType), default=ActivityType.AMPLIFICATION, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)

    user = relationship("User", back_populates="activities")
