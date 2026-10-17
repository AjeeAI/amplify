from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_reach_calculator():
    response = client.get("/api/v1/calculator/reach?amount=25")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["amount"] == 25
    assert data["estimated_impressions"] == 675
    print("[PASS] Reach calculator test passed: $25 = 675 impressions")

def test_campaigns_list():
    response = client.get("/api/v1/campaigns")
    assert response.status_code == 200, response.text
    campaigns = response.json()
    assert len(campaigns) >= 1
    print(f"[PASS] Campaigns list test passed: {len(campaigns)} campaigns loaded")

def test_campaign_detail():
    response = client.get("/api/v1/campaigns/camp-1")
    assert response.status_code == 200, response.text
    camp = response.json()
    assert camp["title"] == "Clean Rivers Initiative: Real-Time Sensor Telemetry"
    print("[PASS] Campaign detail test passed")

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "alex.morgan@civicpulse.org",
        "password": "Ampl!fy2026"
    })
    assert response.status_code == 200, response.text
    token_data = response.json()
    assert "access_token" in token_data
    print("[PASS] Auth login test passed: JWT token issued")
    return token_data["access_token"]

def test_contribution_flow(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/api/v1/campaigns/camp-1/contribute", json={
        "amount": 25.0,
        "payment_method": "apple_pay"
    }, headers=headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["contribution"]["impressions_generated"] == 675
    assert "Injecting Ads" in data["telemetry_status"]
    print("[PASS] Contribution & Success Blast test passed: 675 impressions confirmed")

def test_ai_voice_draft():
    response = client.post("/api/v1/ai/voice-draft", json={
        "transcript_text": "We need $18,500 to deploy 12 water quality sensors along the Charles River basin."
    })
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["category"] == "Climate"
    assert data["target_impressions"] == round(18500 * 27)
    print("[PASS] AI Voice draft test passed: structured campaign extracted")

if __name__ == "__main__":
    test_reach_calculator()
    test_campaigns_list()
    test_campaign_detail()
    jwt_token = test_auth_login()
    test_contribution_flow(jwt_token)
    test_ai_voice_draft()
    print("\nALL FASTAPI BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY!")
