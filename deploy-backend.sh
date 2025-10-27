#!/bin/bash

# Backend deployment script for VIRAL.AI
# Run this AFTER database setup

set -e

APP_DIR="/home/john_aidnas_com/viral-ai"
BACKEND_DIR="$APP_DIR/backend"

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Setting up Python virtual environment...${NC}"
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate

echo -e "${GREEN}Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
pip install psycopg2-binary gunicorn

echo -e "${GREEN}Creating production .env file...${NC}"
cat > $BACKEND_DIR/.env <<'ENVEOF'
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production-viral-ai-2025
DEBUG=False
ALLOWED_HOSTS=viral.ai-it.io,www.viral.ai-it.io,34.42.24.89

# Database
DATABASE_URL=postgresql://john:7DMp`A"4tBbn92gS@10.14.48.3:5432/viral_ai_production

# Redis
REDIS_URL=redis://localhost:6379/0

# LiteLLM (Existing Setup)
LITELLM_API_KEY=sk-QKNerLVHy6UBEQvl0mGpNWMDv488Ig91
LITELLM_BASE_URL=https://litellm.ai-it.io/v1

# Stripe (Payments) - TODO: Add real keys
STRIPE_PUBLIC_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

# SendGrid (Email) - TODO: Add real key
SENDGRID_API_KEY=placeholder
FROM_EMAIL=noreply@viral.ai-it.io

# Google Cloud Storage
GCS_BUCKET_NAME=viral-ai-uploads
GCS_PROJECT_ID=n8n-agent-464619

# n8n Integration
N8N_WEBHOOK_URL=https://auto.ai-it.io/webhook/

# Sentry (Monitoring) - TODO: Add real DSN
SENTRY_DSN=

# CORS
CORS_ALLOWED_ORIGINS=https://viral.ai-it.io,https://www.viral.ai-it.io
CSRF_TRUSTED_ORIGINS=https://viral.ai-it.io,https://www.viral.ai-it.io

# JWT
JWT_SECRET_KEY=jwt-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
ENVEOF

echo -e "${GREEN}Running Django migrations...${NC}"
python manage.py migrate

echo -e "${GREEN}Collecting static files...${NC}"
python manage.py collectstatic --noinput

echo -e "${GREEN}Setting up Gunicorn service...${NC}"
sudo tee /etc/systemd/system/viral-ai.service > /dev/null <<'SERVICEEOF'
[Unit]
Description=Viral AI Gunicorn daemon
After=network.target

[Service]
User=john_aidnas_com
Group=www-data
WorkingDirectory=/home/john_aidnas_com/viral-ai/backend
Environment="PATH=/home/john_aidnas_com/viral-ai/backend/venv/bin"
ExecStart=/home/john_aidnas_com/viral-ai/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/home/john_aidnas_com/viral-ai/backend/viral-ai.sock \
          viral_ai.wsgi:application

[Install]
WantedBy=multi-user.target
SERVICEEOF

echo -e "${GREEN}Starting backend service...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable viral-ai
sudo systemctl start viral-ai

echo -e "${GREEN}Backend deployment complete!${NC}"
echo "Check status: sudo systemctl status viral-ai"
