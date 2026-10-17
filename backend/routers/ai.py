from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Body
from schemas import VoiceDraftResponse, VoiceDraftRequest
from models import CampaignCategory
from config import settings

router = APIRouter(prefix="/ai", tags=["AI Voice Generation"])

@router.post("/voice-draft", response_model=VoiceDraftResponse)
async def voice_draft(
    request_data: Optional[VoiceDraftRequest] = Body(None),
    audio_file: Optional[UploadFile] = File(None)
):
    """
    Transcribes audio stream or takes raw voice transcript,
    and extracts structured campaign parameters (title, category, summary, goal, reach).
    """
    transcript = ""
    if request_data and request_data.transcript_text:
        transcript = request_data.transcript_text
    elif audio_file:
        # In a full deployment, this pipes into OpenAI Whisper / speech-to-text API.
        # For rapid local testing & hackathon simulation, we derive/parse standard prompts.
        transcript = (
            "We need $18,500 to deploy 12 water quality sensors along the Charles River basin "
            "to alert citizens of sewage overflow in real time."
        )
    else:
        transcript = (
            "Deploy autonomous optical sensors to protect public waterways and alert local families of toxic plumes."
        )

    # Heuristic / NLP extraction logic
    lower_t = transcript.lower()
    
    # Category detection
    if any(k in lower_t for k in ["water", "river", "climate", "tree", "heat", "pollution", "carbon"]):
        category = CampaignCategory.CLIMATE
    elif any(k in lower_t for k in ["ai", "algorithm", "privacy", "housing", "tech", "data"]):
        category = CampaignCategory.TECH_SOCIETY
    elif any(k in lower_t for k in ["solar", "battery", "grid", "clean energy", "microgrid"]):
        category = CampaignCategory.CLEAN_ENERGY
    elif any(k in lower_t for k in ["school", "stem", "education", "literacy", "class"]):
        category = CampaignCategory.EDUCATION
    else:
        category = CampaignCategory.CIVIC_TECH

    # Goal amount extraction
    funding_goal = 18500.0
    import re
    match = re.search(r'\$?([0-9]{1,3}(?:,[0-9]{3})*|\d+)', transcript)
    if match:
        try:
            val_str = match.group(1).replace(',', '')
            val = float(val_str)
            if val >= 500:
                funding_goal = val
        except Exception:
            pass

    target_impressions = round(funding_goal * settings.REACH_MULTIPLIER)

    title = "Charles River Sensor Grid: Real-Time Citizen Water Watch"
    if category == CampaignCategory.TECH_SOCIETY:
        title = "Civic AI Watchdog: Algorithmic Justice in Public Housing"
    elif category == CampaignCategory.CLEAN_ENERGY:
        title = "Solar Microgrids for Off-Grid Classrooms"
    elif category == CampaignCategory.EDUCATION:
        title = "Youth Civic Literacy & Public Tech Labs"

    summary = (
        "Deploying autonomous telemetry sensor pods along urban waterways "
        "to deliver instant geo-fenced broadcast alerts to local residents."
    )
    story_content = (
        f"{transcript}\n\n"
        "Every dollar pledged directly funds verified sensor hardware and targeted ad broadcasts "
        "to neighbors within a 5-mile radius of detected contamination hotspots."
    )

    return VoiceDraftResponse(
        title=title,
        category=category,
        summary=summary,
        story_content=story_content,
        funding_goal=funding_goal,
        target_radius_miles=5,
        target_impressions=target_impressions
    )
