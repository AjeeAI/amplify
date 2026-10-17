from datetime import datetime, timezone, timedelta
from database import SessionLocal, engine, Base
import models
from auth import get_password_hash

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(models.User).first():
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding database with Amplify demo accounts and campaigns...")

        # 1. Create Users
        alex = models.User(
            id="user-alex",
            full_name="Alex Morgan",
            email="alex.morgan@civicpulse.org",
            password_hash=get_password_hash("Ampl!fy2026"),
            streak_count=3,
            last_contribution_at=datetime.now(timezone.utc) - timedelta(hours=14),
        )

        maya = models.User(
            id="user-maya",
            full_name="Maya Lin",
            email="maya.lin@riverwatch.org",
            password_hash=get_password_hash("RiverWatch2026"),
            streak_count=12,
            last_contribution_at=datetime.now(timezone.utc) - timedelta(hours=22),
        )

        db.add(alex)
        db.add(maya)
        db.commit()

        # 2. Create Campaigns
        c1 = models.Campaign(
            id="camp-1",
            creator_id=maya.id,
            title="Clean Rivers Initiative: Real-Time Sensor Telemetry",
            category=models.CampaignCategory.CLIMATE,
            summary="Deploying 12 autonomous water quality sensor pods along the urban basin to detect toxic runoff and alert citizens via real-time open alerts.",
            story_content="""Urban industrial runoff and aging sewage storm infrastructure cause over 3.2 billion gallons of untreated discharge every spring. 

Traditional municipal water testing takes 72 to 96 hours to process lab cultures—by which time toxic plumes have reached public swimming docks, drinking reservoirs, and fragile wetland estuaries.

Our project deploys 12 solar-powered, real-time optical fluorometer sensors. Each unit samples dissolved oxygen, pH, turbidity, and chemical nitrates every 60 seconds, streaming cryptographic proofs directly to a public civic dashboard.

Every $1 pledged funds targeted geo-fenced social alerts directly to 27 residents residing within a 4-mile radius of detected contamination hotspots.""",
            funding_goal=20000.0,
            amount_raised=15600.0,
            status=models.CampaignStatus.ACTIVE,
            target_radius_miles=5,
            estimated_total_reach=540000,
            cover_image="https://images.unsplash.com/photo-1544333323-5374ac40d938?w=800&auto=format&fit=crop&q=80",
        )

        c2 = models.Campaign(
            id="camp-2",
            creator_id=maya.id,
            title="Civic AI Watchdog: Algorithmic Justice in Public Housing",
            category=models.CampaignCategory.TECH_SOCIETY,
            summary="Auditing discriminatory predictive policing and tenant-screening algorithms across 18 public housing authorities.",
            story_content="""Automated scoring algorithms are increasingly denying working families access to affordable municipal housing based on opaque proprietary datasets.

Our coalition of data scientists and civil rights attorneys is conducting independent reverse-engineering audits of these commercial tenant-scoring tools.

Your backing directly funds targeted public service announcements informing affected tenants of their legal right to access algorithmic explanations and appeal biased decisions.""",
            funding_goal=35000.0,
            amount_raised=29400.0,
            status=models.CampaignStatus.ACTIVE,
            target_radius_miles=15,
            estimated_total_reach=945000,
            cover_image="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        )

        c3 = models.Campaign(
            id="camp-3",
            creator_id=maya.id,
            title="Solar Microgrids for Off-Grid Rural Schools",
            category=models.CampaignCategory.CLEAN_ENERGY,
            summary="Installing resilient solar + battery packs for 8 rural STEM classrooms facing severe weekly brownouts.",
            story_content="""Over 1,200 rural students lose access to laboratory equipment, digital textbooks, and high-speed satellite connectivity due to fragile grid lines.

By installing decentralized lithium iron phosphate battery banks paired with bifacial rooftop panels, each classroom maintains 100% uptime through stormy seasons.""",
            funding_goal=48000.0,
            amount_raised=48000.0,
            status=models.CampaignStatus.PROMOTING,
            target_radius_miles=45,
            estimated_total_reach=1296000,
            cover_image="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
        )

        db.add_all([c1, c2, c3])
        db.commit()

        # 3. Create Sample Contributions from Alex
        contrib1 = models.Contribution(
            campaign_id=c1.id,
            backer_id=alex.id,
            amount=25.0,
            impressions_generated=675,
            payment_status=models.PaymentStatus.SUCCESS,
        )
        contrib2 = models.Contribution(
            campaign_id=c2.id,
            backer_id=alex.id,
            amount=50.0,
            impressions_generated=1350,
            payment_status=models.PaymentStatus.SUCCESS,
        )
        db.add_all([contrib1, contrib2])
        db.commit()

        # 4. Create Activities (Ripple Feed)
        act1 = models.Activity(
            user_id=alex.id,
            activity_type=models.ActivityType.AMPLIFICATION,
            message="Your $25 contribution went live! 675 targeted impressions distributed to voters in Charles River Basin Ward 4.",
        )
        act2 = models.Activity(
            user_id=alex.id,
            activity_type=models.ActivityType.CONTRIBUTION_MATCH,
            message="2x Partner Match Activated! The Green Earth Foundation activated a $10,000 multiplier pool for all Climate projects.",
        )
        act3 = models.Activity(
            user_id=alex.id,
            activity_type=models.ActivityType.STREAK_UPDATE,
            message="🔥 3-Day Amplification Streak Unlocked! You earned the 'Civic Catalyst Tier II' badge and +150 platform influence points.",
        )
        db.add_all([act1, act2, act3])
        db.commit()

        print("Database seeded successfully with initial campaigns and users!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
