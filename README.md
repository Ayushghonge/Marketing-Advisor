# 🚀 AI Marketing Advisor

AI Marketing Advisor is a modern, premium web application that acts as an intelligent marketing consultant. By analyzing business details, industry vertical, target goals, and available budget, it automatically generates a complete, tailored marketing strategy. It recommends optimal channels, breaks down budgets dynamically, provides detailed content ideas, and gives platform-specific best practices and example campaigns.

---

## ✨ Features

- **🤖 AI-Driven Strategy Generation**: Dynamically integrates with the **Groq API (Llama-3.1)** to analyze goals, industry, and budget, providing structured, contextual insights.
- **📊 Interactive Budget Allocation**: Auto-distributes budget among selected channels and visualizes the breakdown using interactive, responsive **Recharts** pie diagrams.
- **🎯 Platform-Specific Playbooks**: Provides custom deep dives for:
  - *Search Engines*: Google Search Ads, Google Shopping Ads, SEO & Content Strategy.
  - *Social Media*: Meta Ads (Facebook & Instagram), YouTube Video Ads, LinkedIn Marketing.
  - *Engagement*: Email Marketing & Automation, Influencer Marketing, Customer Referral Programs, Local SEO, and Community Marketing.
- **📜 Strategy History**: Automatically saves generated playbooks to a local database for quick access and historical comparison.
- **🎨 Premium UX/UI Design**: Features a highly polished glassmorphic interface, custom dark-mode typography, responsive layouts, and interactive transition micro-animations powered by **Framer Motion**.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **AI Engine**: Groq SDK (`llama-3.1-8b-instant`)
- **Testing**: Pytest & HTTPX

### Frontend
- **Framework**: React (Vite environment)
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Curated custom CSS variables with responsive design system

---

## 📂 Project Structure

```text
marketing_advisor/
├── backend/
│   ├── ai_generator.py      # LLM connection & fallback mock engines
│   ├── database.py          # SQLAlchemy database connection config
│   ├── main.py              # FastAPI endpoints (/api/generate-strategy, /api/history)
│   ├── models.py            # SQLite database models
│   ├── requirements.txt     # Python dependencies
│   └── test_main.py         # Backend endpoint tests
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, layouts)
│   │   ├── pages/           # Pages (Wizard, Dashboard, Platform detail, History)
│   │   ├── App.jsx          # App entrypoint and Router config
│   │   └── index.css        # Global design tokens and styling classes
│   ├── package.json         # Node scripts & dependencies
│   └── vite.config.js       # Vite build configurations
└── .gitignore               # Root git exclusions file
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.8 or higher
- **Node.js**: 18.0 or higher
- **Groq API Key**: (Get one for free at [console.groq.com](https://console.groq.com))

---

### 1. Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   *Windows:*
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
   *macOS/Linux:*
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```
   *(If no API Key is provided, the application will automatically fall back to its internal, highly structured local strategy generator.)*

5. **Start the backend development server**:
   ```bash
   python main.py
   ```
   The backend API will run at `http://localhost:8000`.

---

### 2. Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd ../frontend
   ```

2. **Install Node packages**:
   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173`.

---

## 🧪 Running Tests

You can run automated tests for the backend API endpoints to ensure everything is functioning correctly:

1. Navigate to the `backend` folder and run:
   ```bash
   pytest
   ```
