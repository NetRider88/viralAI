#!/bin/bash

# VIRAL.AI Deployment Script for GCP
# Server: main-server (34.42.24.89)
# Domain: viral.ai-it.io
# Date: October 27, 2025

set -e  # Exit on error

echo "🚀 Starting VIRAL.AI deployment to viral.ai-it.io..."

# Configuration
APP_NAME="viral-ai"
APP_DIR="/home/john_aidnas_com/viral-ai"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
DB_NAME="viral_ai_production"
DB_USER="john"
DB_HOST="10.14.48.3"
DOMAIN="viral.ai-it.io"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Step 1: Creating application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

echo -e "${GREEN}Step 2: Cloning repository...${NC}"
if [ -d ".git" ]; then
    echo "Repository already exists, pulling latest changes..."
    git pull
else
    git clone https://github.com/NetRider88/viralAI.git .
fi

echo -e "${GREEN}Step 3: Setting up PostgreSQL database...${NC}"
echo "Creating database: $DB_NAME"
PGPASSWORD='7DMp\`A"4tBbn92gS' psql -h $DB_HOST -U $DB_USER -d postgres <<EOF
-- Drop database if exists (for clean deployment)
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo -e "${GREEN}Step 4: Creating database schema...${NC}"
PGPASSWORD='7DMp\`A"4tBbn92gS' psql -h $DB_HOST -U $DB_USER -d $DB_NAME < database-schema.sql

echo -e "${GREEN}Step 5: Setting up Python virtual environment...${NC}"
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate

echo -e "${GREEN}Step 6: Installing Python dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt
pip install psycopg2-binary gunicorn

echo -e "${GREEN}Step 7: Creating production .env file...${NC}"
cat > $BACKEND_DIR/.env <<EOF
# Django Settings
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
DEBUG=False
ALLOWED_HOSTS=viral.ai-it.io,www.viral.ai-it.io,34.42.24.89

# Database
DATABASE_URL=postgresql://$DB_USER:7DMp\`A"4tBbn92gS@$DB_HOST:5432/$DB_NAME

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
JWT_SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
EOF

echo -e "${GREEN}Step 8: Running Django migrations...${NC}"
python manage.py migrate

echo -e "${GREEN}Step 9: Collecting static files...${NC}"
python manage.py collectstatic --noinput

echo -e "${GREEN}Step 10: Creating superuser (skip if exists)...${NC}"
echo "You can create a superuser later with: python manage.py createsuperuser"

echo -e "${GREEN}Step 11: Setting up Gunicorn service...${NC}"
sudo tee /etc/systemd/system/viral-ai.service > /dev/null <<EOF
[Unit]
Description=Viral AI Gunicorn daemon
After=network.target

[Service]
User=john_aidnas_com
Group=www-data
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin"
ExecStart=$BACKEND_DIR/venv/bin/gunicorn \\
          --workers 3 \\
          --bind unix:$BACKEND_DIR/viral-ai.sock \\
          viral_ai.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}Step 12: Starting backend service...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable viral-ai
sudo systemctl start viral-ai
sudo systemctl status viral-ai --no-pager

echo -e "${GREEN}Step 13: Setting up frontend...${NC}"
cd $FRONTEND_DIR

# Check if frontend directory has files
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}Warning: Frontend not found in repository. Skipping frontend setup.${NC}"
else
    echo "Installing Node.js dependencies..."
    npm install

    echo "Creating production .env file..."
    cat > $FRONTEND_DIR/.env.production <<EOF
NEXT_PUBLIC_API_URL=https://viral.ai-it.io/api
EOF

    echo "Building frontend..."
    npm run build

    echo "Setting up PM2 for frontend..."
    pm2 delete viral-ai-frontend 2>/dev/null || true
    pm2 start npm --name "viral-ai-frontend" -- start
    pm2 save
fi

echo -e "${GREEN}Step 14: Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/viral.ai-it.io > /dev/null <<'EOF'
# Redirect www to non-www
server {
    listen 80;
    listen [::]:80;
    server_name www.viral.ai-it.io;
    return 301 https://viral.ai-it.io$request_uri;
}

# Main server block
server {
    listen 80;
    listen [::]:80;
    server_name viral.ai-it.io;

    client_max_body_size 100M;

    # Backend API
    location /api/ {
        proxy_pass http://unix:/home/john_aidnas_com/viral-ai/backend/viral-ai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://unix:/home/john_aidnas_com/viral-ai/backend/viral-ai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Short link redirects
    location /l/ {
        proxy_pass http://unix:/home/john_aidnas_com/viral-ai/backend/viral-ai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /home/john_aidnas_com/viral-ai/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /home/john_aidnas_com/viral-ai/backend/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (Next.js) - if available
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo -e "${GREEN}Step 15: Enabling Nginx site...${NC}"
sudo ln -sf /etc/nginx/sites-available/viral.ai-it.io /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo -e "${GREEN}Step 16: Installing SSL certificate...${NC}"
sudo certbot --nginx -d viral.ai-it.io -d www.viral.ai-it.io --non-interactive --agree-tos --email john@ai-it.io || echo -e "${YELLOW}SSL setup failed or already configured${NC}"

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 Your application should now be available at:"
echo "   https://viral.ai-it.io"
echo ""
echo "📋 Next steps:"
echo "   1. Create superuser: cd $BACKEND_DIR && source venv/bin/activate && python manage.py createsuperuser"
echo "   2. Access admin panel: https://viral.ai-it.io/admin/"
echo "   3. Configure Stripe keys in .env file"
echo "   4. Configure SendGrid API key in .env file"
echo "   5. Test the application"
echo ""
echo "📊 Check status:"
echo "   Backend:  sudo systemctl status viral-ai"
echo "   Frontend: pm2 status"
echo "   Nginx:    sudo systemctl status nginx"
echo ""
echo "📝 View logs:"
echo "   Backend:  sudo journalctl -u viral-ai -f"
echo "   Frontend: pm2 logs viral-ai-frontend"
echo "   Nginx:    sudo tail -f /var/log/nginx/error.log"
