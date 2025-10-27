# 🚀 VIRAL.AI-IT.IO

**From Keyword to Viral Post in 60 Seconds**

AI-powered content creation and tracking platform for social media.

---

## 🎯 Features

- 🔍 **Keyword Research** - AnswerThePublic-style keyword discovery
- ✨ **AI Content Generation** - Create platform-optimized content
- 🎨 **Image Generation** - AI-generated or custom uploads
- 🎬 **Video Scripts** - Automated video content creation
- 🔄 **Cross-Platform Adaptation** - One content, multiple platforms
- 🔗 **Link Tracking** - Track clicks and conversions
- 📊 **Analytics Dashboard** - Performance insights

---

## 🛠️ Tech Stack

### Backend
- Django 5.0
- Django REST Framework
- PostgreSQL
- Redis
- Celery

### Frontend
- Next.js 14
- React 18
- TailwindCSS
- shadcn/ui

### AI/ML
- LiteLLM (litellm.ai-it.io)
- GPT-4o, Claude, Gemini
- DALL-E 3, Midjourney
- Veo 3 (Video)

### Infrastructure
- GCP (Google Cloud Platform)
- Cloud SQL (PostgreSQL)
- Cloud Memorystore (Redis)
- Cloud Storage

---

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

---

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URLs
npm run dev
```

---

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture](docs/ARCHITECTURE.md)

---

## 💰 Pricing

- **Free**: 1 content block/month
- **Creator**: $49/mo - 50 blocks/month
- **Pro**: $99/mo - 200 blocks/month
- **Agency**: $299/mo - Unlimited

---

## 📝 License

Proprietary - All Rights Reserved

---

## 👨‍💻 Author

John Mosaad
