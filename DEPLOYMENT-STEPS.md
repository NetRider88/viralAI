# 🚀 VIRAL.AI Deployment to viral.ai-it.io

## Quick Deployment Guide

### Prerequisites ✅
- [x] DNS record created for viral.ai-it.io
- [x] GCP server running (main-server: 34.42.24.89)
- [x] PostgreSQL Cloud SQL available (10.14.48.3)
- [x] Repository cloned: https://github.com/NetRider88/viralAI.git

### Deployment Steps

#### 1. Upload Files to Server
```bash
# From your local machine
cd /Users/jmosaad/Downloads/GCP-HANDOVER-PACKAGE/viralAI

# Copy deployment files to server
gcloud compute scp database-schema.sql deploy-to-gcp.sh main-server:/home/john_aidnas_com/ --zone "us-central1-c" --project "n8n-agent-464619"
```

#### 2. SSH into Server
```bash
gcloud compute ssh --zone "us-central1-c" "main-server" --project "n8n-agent-464619"
```

#### 3. Run Deployment Script
```bash
cd /home/john_aidnas_com
chmod +x deploy-to-gcp.sh
./deploy-to-gcp.sh
```

#### 4. Create Superuser
```bash
cd /home/john_aidnas_com/viral-ai/backend
source venv/bin/activate
python manage.py createsuperuser
```

#### 5. Verify Deployment
- Backend API: https://viral.ai-it.io/api/
- Admin Panel: https://viral.ai-it.io/admin/
- Frontend: https://viral.ai-it.io/

### Database Information

**Database Name:** viral_ai_production  
**Database Host:** 10.14.48.3 (GCP Cloud SQL)  
**Database User:** john  
**Database Password:** Mosaad@88

**Tables Created:**
- users (authentication & profiles)
- subscriptions (billing)
- usage_tracking (quota management)
- keyword_research (keyword data)
- content_blocks (generated content)
- platform_content (platform-specific content)
- trackable_links (link tracking)
- link_clicks (analytics)
- platform_analytics (performance metrics)
- brand_kits (branding)
- image_library (media storage)
- team_members (collaboration)
- platform_connections (social media integrations)

### Application Architecture

```
viral.ai-it.io (Nginx)
    ├── /api/          → Django Backend (Gunicorn)
    ├── /admin/        → Django Admin
    ├── /l/            → Link Redirects
    ├── /static/       → Static Files
    ├── /media/        → User Uploads
    └── /              → Next.js Frontend (PM2)
```

### Services

**Backend Service:**
```bash
sudo systemctl status viral-ai
sudo systemctl restart viral-ai
sudo journalctl -u viral-ai -f
```

**Frontend Service:**
```bash
pm2 status viral-ai-frontend
pm2 restart viral-ai-frontend
pm2 logs viral-ai-frontend
```

**Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Configuration Files

**Backend .env:** `/home/john_aidnas_com/viral-ai/backend/.env`
- Database connection
- LiteLLM integration (litellm.ai-it.io)
- Stripe keys (TODO: add production keys)
- SendGrid API (TODO: add production key)
- JWT secrets

**Frontend .env:** `/home/john_aidnas_com/viral-ai/frontend/.env.production`
- API URL: https://viral.ai-it.io/api

**Nginx Config:** `/etc/nginx/sites-available/viral.ai-it.io`
- SSL certificates (Let's Encrypt)
- Reverse proxy configuration

### Integrations

**LiteLLM (AI Models):**
- URL: https://litellm.ai-it.io/v1
- API Key: sk-QKNerLVHy6UBEQvl0mGpNWMDv488Ig91
- Models: GPT-4o, Claude, Gemini, DeepSeek

**n8n (Automation):**
- URL: https://auto.ai-it.io
- Webhook URL: https://auto.ai-it.io/webhook/
- Use for: Keyword research, platform APIs

**Stripe (Payments):**
- TODO: Add production keys
- Pricing tiers: Free, Creator ($49), Pro ($99), Agency ($299)

**SendGrid (Email):**
- TODO: Add production API key
- From: noreply@viral.ai-it.io

### Post-Deployment Tasks

1. **Configure Payment Processing:**
   - Add Stripe production keys to `.env`
   - Set up webhook endpoints
   - Test payment flow

2. **Configure Email Service:**
   - Add SendGrid API key to `.env`
   - Verify sender domain
   - Test email notifications

3. **Set Up Monitoring:**
   - Configure Sentry DSN
   - Set up uptime monitoring
   - Configure alerts

4. **Create Initial Content:**
   - Create test user
   - Generate sample content
   - Test all features

5. **Documentation:**
   - Update GCP-SETUP-DOCS
   - Add to application list
   - Document backup procedures

### Troubleshooting

**Backend not starting:**
```bash
sudo journalctl -u viral-ai -n 50
cd /home/john_aidnas_com/viral-ai/backend
source venv/bin/activate
python manage.py check
```

**Database connection issues:**
```bash
PGPASSWORD='Mosaad@88' psql -h 10.14.48.3 -U john -d viral_ai_production -c "SELECT 1;"
```

**Frontend not loading:**
```bash
pm2 logs viral-ai-frontend
cd /home/john_aidnas_com/viral-ai/frontend
npm run build
pm2 restart viral-ai-frontend
```

**SSL certificate issues:**
```bash
sudo certbot certificates
sudo certbot renew
```

### Backup & Maintenance

**Database Backup:**
```bash
PGPASSWORD='Mosaad@88' pg_dump -h 10.14.48.3 -U john viral_ai_production > backup_$(date +%Y%m%d).sql
```

**Update Application:**
```bash
cd /home/john_aidnas_com/viral-ai
git pull
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart viral-ai
cd ../frontend
npm install
npm run build
pm2 restart viral-ai-frontend
```

### Support & Resources

- **Repository:** https://github.com/NetRider88/viralAI.git
- **Server IP:** 34.42.24.89
- **Domain:** viral.ai-it.io
- **Database:** viral_ai_production on Cloud SQL
- **GCP Project:** n8n-agent-464619

---

**Deployment Date:** October 27, 2025  
**Deployed By:** John Mosaad  
**Status:** Ready for deployment
