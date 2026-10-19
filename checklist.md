# 📋 Amplify Full-Stack Integration Checklist

Live Backend URL: [`https://amplify-mdmb.onrender.com`](https://amplify-mdmb.onrender.com)  
Interactive API Docs: [`https://amplify-mdmb.onrender.com/docs`](https://amplify-mdmb.onrender.com/docs)  
Mobile Frontend: React Native + Expo (SDK 58)

---

## 🚀 1. Infrastructure & Deployment
- [x] **FastAPI Backend Server**: Running Python 3.11 with Uvicorn.
- [x] **Render Deployment**: Live at `https://amplify-mdmb.onrender.com`.
- [x] **Database Engine**: SQLAlchemy 2.0 with SQLite / PostgreSQL support and automatic schema initialization.
- [x] **Database Auto-Seeding**: Automatic seed script loads initial demo campaigns (*Clean Rivers Initiative*, *Civic AI Watchdog*, *Solar Microgrids*) and user accounts (*Alex Morgan*, *Maya Lin*).
- [x] **Docker Containerization**: `Dockerfile` and `docker-compose.yml` for local and cloud container parity.
- [x] **CORS Configuration**: Enabled across all origins for Expo dev server, simulators, and mobile devices.

---

## 🔐 2. Authentication & Authorization
- [x] **Plain JWT Implementation**: Powered by `PyJWT` with fallback secret key guard (prevents `InvalidKeyError`).
- [x] **Plain Bcrypt Password Hashing**: Direct `bcrypt.hashpw` and `bcrypt.checkpw` without deprecated wrappers.
- [x] **Endpoint: `POST /api/v1/auth/register`**: Creates unified user account (Backer/Creator), initializes Day 1 streak.
- [x] **Endpoint: `POST /api/v1/auth/login`**: Validates credentials and returns JWT Bearer token.
- [x] **Endpoint: `GET /api/v1/auth/me`**: Returns authenticated user profile.
- [x] **Frontend Integration**: [`src/screens/AuthModal.tsx`](file:///c:/dev/amplify/src/screens/AuthModal.tsx):
  - Form inputs default to clean empty fields with full name input on Sign Up.
  - Quick-fill demo account pills (*Alex Morgan - Backer* / *Maya Lin - Creator*) for instant one-tap testing.
  - Real-time password strength meter and toggleable password visibility.
  - Descriptive backend error banner displaying 401/400 messages (e.g. *"Incorrect email or password"*, *"An account with this email already exists"*).
  - Loading spinner indicator during network transmission.
  - Automatically fetches profile and updates [`App.tsx`](file:///c:/dev/amplify/App.tsx) and [`ProfileScreen.tsx`](file:///c:/dev/amplify/src/screens/ProfileScreen.tsx) upon login.

---

## ⚡ 3. The Reach Engine & Formula
- [x] **Server-Side Formula**: $\text{Estimated Impressions} = \text{Amount} \times 27$.
- [x] **Endpoint: `GET /api/v1/calculator/reach`**:
  - Computes guaranteed impressions in $<50\text{ ms}$.
  - Returns estimated local devices reached ($\times 0.42$) and geo-fencing radius.
- [x] **Frontend Integration**: [`src/components/DynamicReachCalculator.tsx`](file:///c:/dev/amplify/src/components/DynamicReachCalculator.tsx) dynamically computes reach for presets ($10, $25, $50, $100) and custom inputs.

---

## 📢 4. Campaigns (Discovery & Editorial)
- [x] **Endpoint: `GET /api/v1/campaigns`**:
  - Supports filtering by `category` (*Climate*, *Tech & Society*, *Clean Energy*, *Education*, *Civic Tech*).
  - Supports sorting by `popular`, `newest`, `funded_desc`.
- [x] **Endpoint: `GET /api/v1/campaigns/{id}`**: Returns full campaign details, financial progress, and creator stats.
- [x] **Endpoint: `POST /api/v1/campaigns`**: Creates new campaign in `DRAFT` state.
- [x] **Endpoint: `PUT /api/v1/campaigns/{id}`**: Updates story, visuals, and audience radius.
- [x] **Endpoint: `POST /api/v1/campaigns/{id}/submit`**: Transitions campaign to `ACTIVE` (simulating peer audit approval).
- [x] **Frontend Integration (Home)**: [`src/screens/HomeScreen.tsx`](file:///c:/dev/amplify/src/screens/HomeScreen.tsx) fetches live campaigns with pull-to-refresh.
- [x] **Frontend Integration (Explore)**: [`src/screens/ExploreScreen.tsx`](file:///c:/dev/amplify/src/screens/ExploreScreen.tsx) fetches campaigns with dynamic distance and 501(c)(3) filters.
- [x] **Frontend Integration (Detail)**: [`src/screens/CampaignDetailModal.tsx`](file:///c:/dev/amplify/src/screens/CampaignDetailModal.tsx) displays 3-stage audit, transparent ledger, and live ad preview.

---

## 💰 5. Contribution & "Success Blast" Flow
- [x] **Endpoint: `POST /api/v1/campaigns/{id}/contribute`**:
  - Simulates payment gateway with tokenized Apple/Google Pay.
  - Automatically increments campaign `amount_raised`.
  - Auto-promotes campaign to `PROMOTING` when funding goal is achieved.
  - Computes verified impression count ($1 = 27$).
  - Logs transaction to user's activity stream.
- [x] **Frontend Integration (Checkout)**: [`src/screens/ContributionModal.tsx`](file:///c:/dev/amplify/src/screens/ContributionModal.tsx) sends contribution request to live backend.
- [x] **Frontend Integration (Success Blast)**: [`src/screens/SuccessBlastModal.tsx`](file:///c:/dev/amplify/src/screens/SuccessBlastModal.tsx) receives live backend response, displaying animated broadcast telemetry (*"Injecting Ads (82%) — Est. broadcast in 4m 12s"*).

---

## 🎙️ 6. "Create with Voice" AI Assist
- [x] **Endpoint: `POST /api/v1/ai/voice-draft`**:
  - Ingests audio files or transcript text strings.
  - NLP/Heuristic engine extracts `title`, `category`, `summary`, `story_content`, and `funding_goal`.
- [x] **Frontend Integration**: [`src/screens/CreateWizardScreen.tsx`](file:///c:/dev/amplify/src/screens/CreateWizardScreen.tsx) records audio pitch and auto-fills wizard fields directly from the API.

---

## 👤 7. User Profile & Streak Gamification
- [x] **Streak Logic**:
  - If last contribution was between 20 and 48 hours ago: `streak_count += 1`.
  - If $>48$ hours ago: `streak_count = 1`.
  - Same day contributions: streak maintained.
- [x] **Endpoint: `GET /api/v1/users/me/dashboard`**:
  - Aggregates total dollars pledged, cumulative audience reach, backed campaigns, and organizer campaigns.
- [x] **Endpoint: `GET /api/v1/users/me/activity`**: Returns paginated ripple impact stream.
- [x] **Frontend Integration (Profile)**: [`src/screens/ProfileScreen.tsx`](file:///c:/dev/amplify/src/screens/ProfileScreen.tsx) displays live streak tracker and portfolio stats.
- [x] **Frontend Integration (Activity)**: [`src/screens/ActivityScreen.tsx`](file:///c:/dev/amplify/src/screens/ActivityScreen.tsx) streams live ripples and match alerts.

---

## 📱 8. Mobile Frontend Health & Type Safety
- [x] **TypeScript Strict Compilation**: `npx tsc --noEmit` $\rightarrow$ **0 errors**.
- [x] **Expo Configuration Validation**: `npx expo-doctor` $\rightarrow$ **21/21 checks passed**.
- [x] **Offline Resilience**: Built-in fallbacks ensure zero crashes if mobile network drops.

---

## 📡 9. Phase 2: Social API & Broadcast Delivery Integrations
- [x] **Programmatic Ad Deployment**: `POST /api/v1/broadcast/deploy` dispatches simulated ad campaigns across Meta Graph & Google Ads ($1 = 27 impressions).
- [x] **Live Broadcast Telemetry**: `GET /api/v1/campaigns/{id}/broadcast-telemetry` returns real-time streaming progress, impressions delivered, and geo-nodes.
- [x] **Meta/Google Webhook Ingestion**: `POST /api/v1/webhooks/ad-telemetry` receives programmatic ad delivery events, increments campaign impressions, and publishes activity updates.
- [x] **In-App Notification & Push Alerts**: `GET /api/v1/notifications/stream` and `POST /api/v1/notifications/register-device` deliver real-time milestone alerts and streak reminders.
- [x] **Frontend Live Ticking Telemetry**: [`src/screens/SuccessBlastModal.tsx`](file:///c:/dev/amplify/src/screens/SuccessBlastModal.tsx) and [`src/screens/CampaignDetailModal.tsx`](file:///c:/dev/amplify/src/screens/CampaignDetailModal.tsx) display live ticking impression counters, connected Meta/Google ad set IDs, and verified local hotspots (*Beacon Hill*, *Back Bay*, *Cambridge*).

---

## 🛡️ 10. Phase 3: Decentralized Verification & Enterprise Matching
- [x] **Corporate CSR Matching Pools**:
  - `GET /api/v1/matching-pools` delivers institutional grantor funds (*Patagonia 1% For The Planet*, *Google.org Civic Tech Fund*, *Ford Foundation*).
  - `POST /api/v1/matching-pools/apply-match` dynamically computes matching grants (e.g. $25 pledge $\rightarrow$ +$25 match = $50 total / 1,350 reach).
- [x] **Frontend Match Bonus UI**: [`src/screens/ContributionModal.tsx`](file:///c:/dev/amplify/src/screens/ContributionModal.tsx) displays live corporate match calculation cards and updates pledge totals.
- [x] **Cryptographically Verifiable Impact Ledger ("Proof of Reach")**:
  - `GET /api/v1/ledger/blocks` and `GET /api/v1/ledger/proof/{contribution_id}` generate verifiable SHA-256 block hashes, previous block hashes, Merkle roots, and Ed25519 signatures.
- [x] **Public Ledger Verification UI**: [`src/screens/ImpactCertificateModal.tsx`](file:///c:/dev/amplify/src/screens/ImpactCertificateModal.tsx) displays interactive cryptographic proof receipts with expandable on-chain verification details.
