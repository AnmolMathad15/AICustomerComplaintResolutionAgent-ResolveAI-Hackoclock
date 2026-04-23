<div align="center">

<img src="public/resolveai-logo.png" alt="ResolveAI Logo" width="180"/>

# ResolveAI — AI Customer Complaint Resolution Agent

### *Where AI Meets Real Customer Care*

[![Hackathon](https://img.shields.io/badge/Hack0'Clock-2026-f97316?style=for-the-badge&logo=lightning&logoColor=white)](https://github.com)
[![Track](https://img.shields.io/badge/Track-AI%2FML-7c3aed?style=for-the-badge&logo=brain&logoColor=white)](https://github.com)

[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

**[Live Demo](https://your-replit-url.replit.dev) · [Backend API](https://your-backend.replit.dev/docs) · [Demo Video](#demo)**

</div>

---

## The Problem

Customer support is broken at its core.

Customers are forced to **repeat their issues** every time they switch channels — chat, email, phone — while support agents operate **without any unified view** of the customer's history. The result: delayed resolutions, inconsistent responses, and a deeply frustrating experience.

> 67% of customer churn is preventable if issues are resolved at first contact. Yet most systems today are still reactive, siloed, and manual.

---

## Our Solution

**ResolveAI** is an intelligent AI-powered complaint resolution agent that acts like a senior support agent who has actually read your file.

```
Customer types complaint
        ↓
🧠 Sentiment Analyzer      →  Detects frustration in real time
        ↓
🏷️  Complaint Classifier   →  Type + Severity (zero-shot NLP)
        ↓
📋 Customer History        →  Full cross-channel context retrieved
        ↓
⚖️  Policy Engine          →  Resolution within business rules
        ↓
📊 Confidence Scorer       →  Explainable AI decision score
        ↓
    ┌───┴───┐
Confident?    Not confident / frustrated?
    ↓                    ↓
✅ Resolve        🚨 Escalate with summary
```

---

## Screenshots

<div align="center">
<img width="1912" height="845" alt="dashboard" src="https://github.com/user-attachments/assets/8b782689-1038-4af8-9cde-d456f5a52ca8" />
| Chat AI | Customer Portal |
|:---:|:---:|
| ![Chat](screenshots/chat.png) | ![Portal](screenshots/portal.png) |

| Complaints Log | Customer Profiles |
|:---:|:---:|
| ![Complaints](screenshots/complaints.png) | ![Customers](screenshots/customers.png) |

</div>

---

## Key Features

- **Multi-Channel History Synthesis** — Aggregates past chat, email, and ticket interactions into one unified customer timeline
- **Zero-Shot Complaint Classification** — Classifies complaint type and severity with no model training required
- **Policy Constraint Engine** — AI resolutions stay within predefined business rules — every time
- **Real-Time Sentiment Escalation** — Detects frustration before the customer reaches breaking point
- **Automated Escalation with Summary** — Human agents receive full context — no cold handoffs
- **Resolution Confidence Score** — Every AI decision comes with explainable confidence breakdown
- **Multi-Company Portal** — Supports Amazon, Flipkart, Swiggy with company-specific policies
- **Multi-Language Support** — English, Hindi, Kannada, Tamil, Telugu, Spanish, French
- **Voice Input** — Speak your complaint directly using Web Speech API
- **SLA Health Monitoring** — Real-time tracking of within/approaching/breached SLA tickets
- **AI Reasoning Transparency** — "Why did AI decide this?" panel for every resolution

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | React framework with SSR |
| Tailwind CSS | Utility-first styling |
| ShadCN UI | Component library |
| Recharts | Analytics charts |
| Axios | API communication |
| Web Speech API | Voice input |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API framework |
| Python 3.11 | Runtime |
| Uvicorn | ASGI server |
| Pydantic | Request/response validation |

### AI / ML
| Model | Task | Why |
|-------|------|-----|
| `facebook/bart-large-mnli` | Complaint Classification | Zero-shot, no training needed |
| `cardiffnlp/twitter-roberta-base-sentiment-latest` | Sentiment Analysis | Trained on real frustrated language |
| `facebook/bart-large-cnn` | Escalation Summary | Condenses history for human agent |

---

## Project Structure

```
resolveai/
├── frontend/                    # Next.js 14 App
│   ├── app/
│   │   ├── dashboard/          # Command center
│   │   ├── chat/               # Chat AI interface
│   │   ├── analyze/            # AI analysis tool
│   │   ├── complaints/         # Complaint log
│   │   ├── customers/          # Customer profiles
│   │   ├── escalations/        # Escalation queue
│   │   └── portal/             # Customer portal
│   ├── components/
│   │   ├── ChatPanel.tsx
│   │   ├── EscalationCard.tsx
│   │   ├── ConfidenceBar.tsx
│   │   ├── DashboardCharts.tsx
│   │   └── CustomerTimeline.tsx
│   └── lib/
│       └── api.ts              # API client
│
├── backend/                     # FastAPI Backend
│   ├── main.py                 # Entry point + all routes
│   ├── models/
│   │   ├── classifier.py       # Complaint classifier
│   │   ├── sentiment.py        # Sentiment analyzer
│   │   └── summarizer.py       # Escalation summarizer
│   ├── engine/
│   │   ├── policy_engine.py    # Business rules
│   │   ├── confidence.py       # Confidence scorer
│   │   └── escalation.py       # Escalation logic
│   └── data/
│       ├── customers.json      # Customer database
│       └── policies.json       # Policy rules
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- pip

### 1. Clone the repository
```bash
git clone https://github.com/AnmolMathad/ResolvAI-Customer-Complaint-Resolution-Agent-Hackoclock.git
cd ResolvAI-Customer-Complaint-Resolution-Agent-Hackoclock
```

### 2. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Environment Variables
Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Reference

### POST `/analyze`
Analyze a customer complaint end-to-end.

**Request:**
```json
{
  "complaint": "My refund hasn't arrived after 3 weeks",
  "customer_id": "CUST001"
}
```

**Response:**
```json
{
  "ticket_id": "TKT-143021-5892",
  "customer_name": "Rahul Sharma",
  "customer_tier": "Premium",
  "complaint_type": "refund",
  "severity": "HIGH",
  "confidence_percentage": 84.5,
  "confidence_level": "HIGH",
  "sentiment": "negative",
  "frustration_score": 78.3,
  "resolution": "Your refund has been initiated...",
  "policy_code": "POL-REF-002",
  "sla_hours": 48,
  "should_escalate": true,
  "escalation": {
    "assigned_agent": "Sneha Patil",
    "escalation_reasons": ["High frustration detected"],
    "summary": "Customer reporting delayed refund..."
  }
}
```

### GET `/customer/{customer_id}`
Retrieve full customer profile and history.

### GET `/dashboard/stats`
Real-time dashboard statistics.

### POST `/escalate`
Manually trigger escalation for a ticket.

---

## How the AI Works

### 1. Complaint Classification (Zero-Shot)
Uses `facebook/bart-large-mnli` to classify complaints into 6 categories without any training data. Simply provides candidate labels and the model reasons about which fits best.

### 2. Sentiment Analysis
`cardiffnlp/twitter-roberta-base-sentiment-latest` was fine-tuned on real social media frustration language — making it ideal for detecting angry customers before they churn.

### 3. Confidence Scoring
```
confidence = (classification_score × 0.5) 
           + (policy_match × 0.3) 
           + (history_factor × 0.2)

If confidence < 0.60 → trigger escalation
```

### 4. Policy Engine
All resolutions are constrained by a rule engine. The AI **cannot** offer refunds above the policy limit or resolve security breaches automatically. This makes it safe for real-world deployment.

---

## Demo

### The Winning Demo Sequence
1. Open **Customer Portal** → Select **Swiggy**
2. Type: *"I am furious! This is my third refund request this week and nobody has helped me. This is completely unacceptable."*
3. Watch: Sentiment → **Negative (89%)** → Escalation triggered
4. Switch to **Dashboard** → Complaint appears live
5. Open **Escalation Queue** → Full context ready for human agent
6. Click **"View AI Reasoning"** → Confidence breakdown shown

> Total time from complaint to resolution decision: **~3 seconds**

---

## Team

| Name | Role |
|------|------|
| Anmol Mathad | Team Lead / Full Stack |
| Harsha B Ganamukhi | Frontend / UI |
| Matam  Litika | Backend / ML |
| Abhishek  S Gadaginamath Presentation / Testing |

---

## What Makes ResolveAI Different

| Feature | Generic Chatbot | ResolveAI |
|---------|----------------|-----------|
| Customer memory | None | Full cross-channel history |
| Policy enforcement | None | Hard business rule constraints |
| Escalation | Manual | Intelligent with full context |
| Explainability | Black box | Confidence breakdown per decision |
| Multi-company | No | Amazon, Flipkart, Swiggy |
| Language support | English only | 7 languages |

---

## Future Roadmap

- [ ] Integration with real CRM systems (Salesforce, Zendesk)
- [ ] WhatsApp / Telegram bot interface
- [ ] Fine-tuned model on industry-specific complaint data
- [ ] Voice call transcription and analysis
- [ ] Automated SLA breach alerts via email/SMS
- [ ] Analytics export to BI tools (Tableau, Power BI)

---

## Built At

<div align="center">

**Hack0'Clock 2026** · KLE Institute of Technology · IEEE Computer Society  
*April 23–24, 2026 · Hubballi, Karnataka, India*

*AI/ML Track — Problem Statement AI-19*

</div>

---

<div align="center">

Made with passion at 3 AM ☕ by Team ResolveAI

**[Live Demo](https://your-replit-url.replit.dev) · [Report Bug](https://github.com/AnmolMathad/ResolvAI-Customer-Complaint-Resolution-Agent-Hackoclock/issues) · [API Docs](https://your-backend.replit.dev/docs)**

</div>
