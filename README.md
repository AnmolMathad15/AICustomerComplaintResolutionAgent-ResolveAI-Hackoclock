<div align="center">

<!-- HERO BANNER -->
<img src="assets/hero-banner.png" width="100%" />

<br><br>

<!-- BADGES -->
<p>
  <img src="https://img.shields.io/badge/HACK%C2%B0CLOCK-2026-purple" />
  <img src="https://img.shields.io/badge/TRACK-AI%2FML-blue" />
  <img src="https://img.shields.io/badge/LICENSE-MIT-green" />
  <img src="https://img.shields.io/badge/PYTHON-3.11-blue" />
  <img src="https://img.shields.io/badge/NEXT.JS-14-black" />
</p>

<h1>🧠 ResolveAI</h1>

<p><b>AI-Powered Customer Complaint Resolution Agent</b></p>

<p><i>"Turning customer frustration into intelligent, real-time resolution."</i></p>

<br>

<p>
  <a href="https://ai-customer-complaint-resolution-agent-resolve--koalabunny1515.replit.app/"><b>🌐 Live Demo</b></a> |
  <a href="https://github.com/AnmolMathad15/AICustomerComplaintResolutionAgent-ResolveAI-Hackoclock"><b>📄 API Docs</b></a> |
  <a href="https://youtube.com/your-video"><b>🎥 Demo Video</b></a> |
  <a href="https://drive.google.com/file/d/1bzi15pteUK7xydzjyw4J4q_wkKq-b8HR/view?usp=sharing"><b>📊 Report / PPT</b></a>
</p>

</div>

---

---

## 🎯 The Problem

Customer support is broken at its core.

Customers are forced to **repeat their issues** every time they switch channels — chat, email, phone — while support agents operate without any unified view of the customer's history. The result: delayed resolutions, inconsistent responses, and a deeply frustrating experience.

> 💡 **67% of customer churn is preventable if issues are resolved at first contact.** Yet most systems today are still reactive, siloed, and manual.

---

## 💡 Our Solution

**ResolveAI** is an intelligent AI-powered complaint resolution agent that acts like a senior support agent who has *actually read your file*.

```
Customer types complaint
        ↓
🔴 Sentiment Analyzer    →  Detects frustration in real time
        ↓
🟡 Complaint Classifier  →  Type + Severity (zero-shot NLP)
        ↓
🟢 Customer History      →  Full cross-channel context retrieved
        ↓
🛡️ Policy Engine        →  Resolution within business rules
        ↓
📊 Confidence Scorer     →  Explainable AI decision score
        ↓
   Confident?          Not confident / frustrated?
        ↓                          ↓
  ✅ Resolve            🚨 Escalate with summary
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧠 **Zero-Shot Complaint Classification** | Classifies complaint type and severity with no model training required |
| 💬 **Real-Time Sentiment Escalation** | Detects frustration before the customer reaches breaking point |
| 🛡️ **Policy Constraint Engine** | AI resolutions stay within predefined business rules — every time |
| 📊 **Resolution Confidence Score** | Every AI decision comes with an explainable confidence breakdown |
| 🚨 **Automated Escalation with Summary** | Human agents receive full context — no cold handoffs |
| 🌍 **Multi-Language Support** | English, Hindi, Kannada, Tamil, Telugu, Spanish, French |
| 🏢 **Multi-Company Portal** | Supports Amazon, Flipkart, Swiggy with company-specific policies |
| 🎙️ **Voice Input** | Speak your complaint directly using Web Speech API |
| 📈 **SLA Health Monitoring** | Real-time tracking of within/approaching/breached SLA tickets |
| 🔍 **AI Reasoning Transparency** | "Why did AI decide this?" panel for every resolution |
| 🗂️ **Multi-Channel History Synthesis** | Aggregates past chat, email, and ticket interactions into one unified timeline |

---

## 📸 Screenshots

### 🧭 Dashboard Overview
The central control panel showing real-time complaint metrics, AI insights, and system performance.

<img src="assets/dashboard.png" width="100%" />

---

### 📂 Complaint Management
View, filter, and manage customer complaints with priority levels, sentiment tags, and status tracking.

<img src="assets/complaints.png" width="100%" />

---

### 🤖 AI Chat Assistant
Users can submit complaints conversationally, and the AI provides instant classification and resolution suggestions.

<img src="assets/chat.png" width="100%" /><img width="959" height="425" alt="complaints" src="https://github.com/user-attachments/assets/67a04c7a-f65c-434f-907a-81e3fa79e19a" />
<img width="959" height="422" alt="chat" src="https://github.com/user-attachments/assets/e65ad074-0253-4e8e-82bf-f196bb8eb742" />
<img width="959" height="425" alt="complaints" src="https://github.com/user-attachments/assets/0a991803-695e-4ebf-a14d-0841bd6c45dd" />
<img width="960" height="424" alt="dashboard" src="https://github.com/user-attachments/assets/506e1481-237f-4440-a8aa-053df0684aba" />

---

## ⚙️ How the AI Works

### 1. 🏷️ Complaint Classification (Zero-Shot)
Uses `facebook/bart-large-mnli` to classify complaints into **6 categories** without any training data. Simply provides candidate labels and the model reasons about which fits best.

### 2. 💢 Sentiment Analysis
`cardiffnlp/twitter-roberta-base-sentiment-latest` was fine-tuned on real social media frustration language — making it ideal for detecting angry customers **before they churn**.

### 3. 📐 Confidence Scoring
```python
confidence = (classification_score × 0.5)
           + (policy_match       × 0.3)
           + (history_factor     × 0.2)

if confidence < 0.60 → trigger escalation
```

### 4. 🛡️ Policy Engine
All resolutions are constrained by a rule engine. The AI **cannot** offer refunds above the policy limit or resolve security breaches automatically. This makes it safe for real-world deployment.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with SSR |
| Tailwind CSS | Utility-first styling |
| ShadCN UI | Component library |
| Recharts | Analytics charts |
| Axios | API communication |
| Web Speech API | Voice input |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Python 3.11 | Runtime |
| Uvicorn | ASGI server |
| Pydantic | Request/response validation |

### AI / ML
| Model | Task | Why |
|---|---|---|
| `facebook/bart-large-mnli` | Complaint Classification | Zero-shot, no training needed |
| `cardiffnlp/twitter-roberta-base-sentiment-latest` | Sentiment Analysis | Trained on real frustrated language |
| `facebook/bart-large-cnn` | Escalation Summary | Condenses history for human agent |

### Database & Tools
`PostgreSQL` &nbsp; `SQLAlchemy` &nbsp; `Redis` &nbsp; `Docker`

---

## 📁 Project Structure

```
resolveai/
├── frontend/                    # Next.js 14 App
│   ├── app/
│   │   ├── dashboard/           # Command center
│   │   ├── chat/                # Chat AI interface
│   │   ├── analyze/             # AI analysis tool
│   │   ├── complaints/          # Complaint log
│   │   ├── customers/           # Customer profiles
│   │   ├── escalations/         # Escalation queue
│   │   └── portal/              # Customer portal
│   ├── components/
│   │   ├── ChatPanel.tsx
│   │   ├── EscalationCard.tsx
│   │   ├── ConfidenceBar.tsx
│   │   ├── DashboardCharts.tsx
│   │   └── CustomerTimeline.tsx
│   └── lib/
│       └── api.ts               # API client
│
├── backend/                     # FastAPI Backend
│   ├── main.py                  # Entry point + all routes
│   ├── models/
│   │   ├── classifier.py        # Complaint classifier
│   │   ├── sentiment.py         # Sentiment analyzer
│   │   └── summarizer.py        # Escalation summarizer
│   ├── engine/
│   │   ├── policy_engine.py     # Business rules
│   │   ├── confidence.py        # Confidence scorer
│   │   └── escalation.py        # Escalation logic
│   └── data/
│       └── customer_data/       # Customer database
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- pip

### 1. Clone the Repository
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
Backend runs at: `http://localhost:8000` &nbsp; | &nbsp; API docs at: `http://localhost:8000/docs`

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

## 📡 API Reference

### `POST /analyze`
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
  "ticket_id": "TKT-143021-5002",
  "customer_name": "Rahul Sharma",
  "customer_tier": "Premium",
  "category": "Refund",
  "severity": "High",
  "sentiment": "Negative (89%)",
  "confidence": 0.82,
  "resolution": "Initiating priority refund within 24 hours",
  "escalated": false,
  "ai_reasoning": "High-value customer with 3 prior refund attempts..."
}
```

### `GET /dashboard/stats`
Real-time dashboard statistics.

### `POST /escalate`
Manually trigger escalation for a ticket.

---

## 🎬 The Winning Demo Sequence

1. Open **Customer Portal** → Select **Swiggy**
2. Type: *"I am furious! This is my third refund request this week and nobody has helped me. This is completely unacceptable."*
3. Watch: **Sentiment → Negative (89%)** → Escalation triggered
4. Switch to **Dashboard** → Complaint appears live
5. Open **Escalation Queue** → Full context ready for human agent
6. Click **"View AI Reasoning"** → Confidence breakdown shown

> ⏱️ Total time from complaint to resolution decision: **~3 seconds**

---

## 🆚 What Makes ResolveAI Different?

| Feature | Generic Chatbot | ResolveAI |
|---|---|---|
| Customer memory | None | Full cross-channel history |
| Policy enforcement | None | Hard business rule constraints |
| Escalation | Manual | Intelligent with full context |
| Explainability | Black box | Confidence breakdown per decision |
| Multi-company | No | Amazon, Flipkart, Swiggy |
| Language support | English only | 7 languages |

---

## 🗺️ Future Roadmap

- [ ] Integration with real CRM systems (Salesforce, Zendesk)
- [ ] WhatsApp / Telegram bot interface
- [ ] Fine-tuned model on industry-specific complaint data
- [ ] Voice call transcription and analysis
- [ ] Automated SLA breach alerts via email/SMS
- [ ] Analytics export to BI tools (Tableau, Power BI)

---

## 👥 Team

| Name | Role |
|---|---|
| **Anmol Mathad** | Team Lead / Full Stack |
| **Harsha B Ganamukhi** | Frontend / UI |
| **Matam Litika** | Backend / ML |
| **Abhishek S Gadaginamath** | Presentation / Testing |

---

## 🏆 Built At

<div align="center">

**Hack0'Clock 2026** · KLE Institute of Technology · IEEE Computer Society

*April 23–24, 2026 · Hubballi, Karnataka, India*

**AI/ML Track — Problem Statement AI-19**

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

💜 **Where AI Meets Real Customer Care** 💜

<br/>

*Made with ❤️ at Hack0'Clock 2026*

</div>
