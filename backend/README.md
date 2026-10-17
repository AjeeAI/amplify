# 🚀 Amplify Backend Documentation

## 1. Project Overview
**Amplify** is a civic tech and crowdfunding API designed to convert financial pledges into targeted social media impressions.

Based on the MVP specifications, this backend serves a mobile-first React Native (Expo) frontend. It handles user authentication, state-based campaign creation, AI-assisted content drafting, dynamic reach calculations, and simulated payment workflows.

> **Note on Scope:** As per the hackathon constraints, the Admin Panel and real-world Ad Platform integrations (Meta/Google Ads API) are omitted from this iteration. Ad routing and campaign approvals are simulated.

---

## 2. Tech Stack & Infrastructure
* **Framework:** Python 3.10+ with [FastAPI](https://fastapi.tiangolo.com/) (Chosen for async performance and automatic OpenAPI documentation)
* **Database:** PostgreSQL (with SQLite default fallback for instant zero-dependency local development)
* **ORM:** SQLAlchemy 2.0 + Pydantic v2 (for strict type hinting and data validation)
* **Authentication:** Plain JWT (`PyJWT` / `python-jwt`) and plain `bcrypt`
* **AI Integration:** OpenAI API (or heuristic voice draft engine fallback) for the "Create with Voice" transcription and text parsing.

---

## 3. Database Schema (PostgreSQL / Relational)
The system requires a unified user model (one account acts as Creator, Backer, and Audience).

### `users`
* `id` (UUID, Primary Key)
* `full_name` (String)
* `email` (String, Unique)
* `password_hash` (String)
* `streak_count` (Int, Default: 0) — For the "Impact Streak" gamification
* `last_contribution_at` (Timestamp, Nullable)
* `created_at` (Timestamp)

### `campaigns`
* `id` (UUID, Primary Key)
* `creator_id` (UUID, Foreign Key $\rightarrow$ `users.id`)
* `title` (String, Max 60 chars)
* `category` (Enum: `Climate`, `Tech & Society`, `Education`, `Civic Tech`, `Clean Energy`)
* `summary` (Text)
* `story_content` (Text - HTML/Markdown)
* `funding_goal` (Decimal)
* `amount_raised` (Decimal, Default: 0.00)
* `status` (Enum: `DRAFT`, `REVIEW_PENDING`, `ACTIVE`, `PROMOTING`, `COMPLETED`)
* `target_radius_miles` (Int)
* `estimated_total_reach` (Int, Default: 0)
* `cover_image` (String, Nullable)
* `created_at` (Timestamp)

### `contributions`
* `id` (UUID, Primary Key)
* `campaign_id` (UUID, Foreign Key $\rightarrow$ `campaigns.id`)
* `backer_id` (UUID, Foreign Key $\rightarrow$ `users.id`)
* `amount` (Decimal)
* `impressions_generated` (Int) — Calculated dynamically ($1 = 27$ impressions)
* `payment_status` (Enum: `PENDING`, `SUCCESS`, `FAILED`)
* `created_at` (Timestamp)

### `activities` (Ripple Impact Feed)
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key $\rightarrow$ `users.id`)
* `activity_type` (Enum: `CONTRIBUTION_MATCH`, `MILESTONE`, `STREAK_UPDATE`, `AMPLIFICATION`)
* `message` (Text) — e.g., *"Your $25 contribution just helped Clean Rivers reach 675 new people."*
* `created_at` (Timestamp)

---

## 4. REST API Endpoints Specification

FastAPI automatically generates interactive Swagger UI docs at `/docs` and ReDoc at `/redoc`.

### 🔐 Authentication
* `POST /api/v1/auth/register` — Create a unified user account.
* `POST /api/v1/auth/login` — Authenticate and return JWT token.
* `GET /api/v1/auth/me` — Retrieve current authenticated user profile.

### 📢 Campaigns (The Core Flow)
* `GET /api/v1/campaigns`
  * **Query Params:** `category`, `status`, `sort_by`, `skip`, `limit`
  * **Response:** Paginated list of active campaigns for the Home/Explore feeds.
* `GET /api/v1/campaigns/{id}`
  * **Response:** Full editorial details, review stages, and transparent ledger of a specific campaign.
* `POST /api/v1/campaigns`
  * **Body:** Step 1 Basics (`title`, `category`, `funding_goal`, `summary`).
  * **Response:** Creates a campaign in `DRAFT` state.
* `PUT /api/v1/campaigns/{id}`
  * **Action:** Updates draft steps (`story_content`, `cover_image`, `target_radius_miles`, `funding_goal`).
* `POST /api/v1/campaigns/{id}/submit`
  * **Action:** Transitions campaign from `DRAFT` to `ACTIVE` (simulating the omitted admin review).

### 🎙️ AI Voice Generation
* `POST /api/v1/ai/voice-draft`
  * **Payload:** Multipart audio file or JSON transcript text.
  * **Action:** Transcribes audio and uses AI parsing to extract JSON containing `title`, `summary`, `category`, and `funding_goal`.

### 💰 Funding & Simulation
* `GET /api/v1/calculator/reach`
  * **Query Params:** `amount` (e.g., 25)
  * **Response:** `{"amount": 25, "estimated_impressions": 675}` (Based on the core formula: $1 = 27$ impressions).
* `POST /api/v1/campaigns/{id}/contribute`
  * **Body:** `amount`, `payment_method` (dummy token)
  * **Action:** Simulates payment gateway, increments campaign `amount_raised`, triggers a "Success Blast" response with live broadcast telemetry, and creates an Activity ledger entry.

### 👤 Profile & Activity
* `GET /api/v1/users/me/dashboard`
  * **Response:** Returns user profile, current `streak_count`, list of `backed_campaigns`, and list of `my_campaigns`.
* `GET /api/v1/users/me/activity`
  * **Response:** Paginated list of recent notifications/ripples for the Activity Tab.

---

## 5. Core Business Logic & Formulas

### The Reach Engine
The platform operates on a fixed ratio for the MVP:
$$\text{Estimated Reach} = \text{Contribution Amount} \times 27$$
This calculation is handled server-side to guarantee that the React Native checkout modal and the final post-pledge "Success Blast" report identical numbers to the user.

### Campaign State Machine
$$\text{DRAFT} \longrightarrow \text{REVIEW\_PENDING} \longrightarrow \text{ACTIVE} \longrightarrow \text{PROMOTING} \longrightarrow \text{COMPLETED}$$
1. Campaign created $\rightarrow$ `DRAFT`.
2. Wizard completed $\rightarrow$ `REVIEW_PENDING`.
3. Auto-Simulated for MVP $\rightarrow$ `ACTIVE` (Now visible in Home/Explore feeds).
4. Funding Goal reached $\rightarrow$ `PROMOTING` (Simulates ad injection).

### Streak Gamification Logic
When a `POST /contribute` request is successful, the server checks the timestamp of the user's last contribution:
* If it occurred **1 day prior** (between 20 and 48 hours ago): `streak_count += 1`.
* If **> 2 days prior**: `streak_count = 1`.
* If within the same day: streak maintained without reset.

---

## 6. Running the Backend Locally

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Seed Initial Mock Campaigns & Users
```bash
python seed.py
```

### 3. Start the Development Server
```bash
uvicorn main:app --reload --port 8000
```

### 4. Interactive Documentation
* Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
