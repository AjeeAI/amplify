from fastapi import APIRouter, Query
from schemas import ReachCalculation
from config import settings

router = APIRouter(prefix="/calculator", tags=["Funding & Simulation"])

@router.get("/reach", response_model=ReachCalculation)
def calculate_reach(amount: float = Query(..., gt=0, description="Pledge amount in USD")):
    """
    Computes real-time expected impressions using the core platform formula:
    Estimated Reach = Contribution Amount * 27
    """
    multiplier = settings.REACH_MULTIPLIER
    estimated_impressions = round(amount * multiplier)
    devices_estimate = round(estimated_impressions * 0.42)
    
    if amount >= 100:
        radius_estimate = "12.5 mi radius"
    elif amount >= 50:
        radius_estimate = "8.0 mi radius"
    elif amount >= 25:
        radius_estimate = "4.2 mi radius"
    else:
        radius_estimate = "2.0 mi radius"

    return ReachCalculation(
        amount=amount,
        estimated_impressions=estimated_impressions,
        multiplier=multiplier,
        devices_estimate=devices_estimate,
        radius_estimate=radius_estimate
    )
