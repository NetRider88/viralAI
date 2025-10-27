# 🚀 Deployment Guide for viral.ai-it.io

**Domain:** `viral.ai-it.io`  
**Date:** October 26, 2025

---

## Prerequisites

### DNS Configuration
1. **A Record** - Point `viral.ai-it.io` to your server IP
2. **A Record** - Point `www.viral.ai-it.io` to your server IP
3. **CNAME Record** (optional) - Point `api.viral.ai-it.io` to your server

### Server Requirements
- **OS:** Ubuntu 22.04 LTS (recommended)
- **RAM:** Minimum 2GB, Recommended 4GB+
- **CPU:** 2+ cores
- **Storage:** 20GB+ SSD
- **Python:** 3.11+
- **Node.js:** 18+ LTS
- **PostgreSQL:** 14+
- **Redis:** 6+
- **Nginx:** Latest

---

## Backend Deployment (Django)

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib redis-server nginx certbot python3-certbot-nginx

# Create app user
sudo useradd -m -s /bin/bash viralai
sudo usermod -aG sudo viralai
```

### 2. PostgreSQL Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE viral_ai_db;
CREATE USER viral_ai_user WITH PASSWORD 'your-secure-password';
ALTER ROLE viral_ai_user SET client_encoding TO 'utf8';
ALTER ROLE viral_ai_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE viral_ai_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE viral_ai_db TO viral_ai_user;
\q
```

### 3. Deploy Backend

```bash
# Switch to app user
sudo su - viralai

# Clone repository
git clone https://github.com/your-repo/viral-ai.git
cd viral-ai/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Create production .env file
cp .env.production.example .env
nano .env  # Edit with your production values

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test server
gunicorn viral_ai.wsgi:application --bind 0.0.0.0:8000
```

### 4. Gunicorn Service

Create `/etc/systemd/system/viralai.service`:

```ini
[Unit]
Description=Viral AI Gunicorn daemon
After=network.target

[Service]
User=viralai
Group=www-data
WorkingDirectory=/home/viralai/viral-ai/backend
ExecStart=/home/viralai/viral-ai/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/home/viralai/viral-ai/backend/viralai.sock \
          viral_ai.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable viralai
sudo systemctl start viralai
sudo systemctl status viralai
```

---

## Frontend Deployment (Next.js)

### 1. Build Frontend

```bash
cd /home/viralai/viral-ai/frontend

# Install dependencies
npm install

# Create production .env
echo "NEXT_PUBLIC_API_URL=https://viral.ai-it.io/api" > .env.production

# Build for production
npm run build

# Test production build
npm start
```

### 2. PM2 Setup (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start Next.js with PM2
pm2 start npm --name "viralai-frontend" -- start
pm2 save
pm2 startup
```

---

## Nginx Configuration

### 1. Create Nginx Config

Create `/etc/nginx/sites-available/viral.ai-it.io`:

```nginx
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

    # Redirect HTTP to HTTPS (will be enabled after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Backend API
    location /api/ {
        proxy_pass http://unix:/home/viralai/viral-ai/backend/viralai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://unix:/home/viralai/viral-ai/backend/viralai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Short link redirects
    location /l/ {
        proxy_pass http://unix:/home/viralai/viral-ai/backend/viralai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /home/viralai/viral-ai/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /home/viralai/viral-ai/backend/media/;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/viral.ai-it.io /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## SSL Certificate (Let's Encrypt)

```bash
# Install SSL certificate
sudo certbot --nginx -d viral.ai-it.io -d www.viral.ai-it.io

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL is installed, uncomment the HTTPS redirect in Nginx config.

---

## Environment Variables

### Backend (.env)

```bash
DEBUG=False
SECRET_KEY=your-super-secret-production-key
ALLOWED_HOSTS=viral.ai-it.io,www.viral.ai-it.io

DATABASE_URL=postgresql://viral_ai_user:password@localhost:5432/viral_ai_db

OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
YOUTUBE_API_KEY=your-key

CORS_ALLOWED_ORIGINS=https://viral.ai-it.io,https://www.viral.ai-it.io
CSRF_TRUSTED_ORIGINS=https://viral.ai-it.io,https://www.viral.ai-it.io
```

### Frontend (.env.production)

```bash
NEXT_PUBLIC_API_URL=https://viral.ai-it.io/api
```

---

## Post-Deployment Checklist

### Security
- [ ] Change SECRET_KEY to a strong random value
- [ ] Set DEBUG=False
- [ ] Configure firewall (UFW)
- [ ] Enable fail2ban
- [ ] Set up regular backups
- [ ] Configure Sentry for error tracking

### Performance
- [ ] Enable Redis caching
- [ ] Configure CDN (Cloudflare)
- [ ] Optimize database indexes
- [ ] Set up monitoring (Prometheus/Grafana)

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log rotation
- [ ] Set up alerts for errors
- [ ] Monitor server resources

---

## Maintenance Commands

### Backend

```bash
# Restart backend
sudo systemctl restart viralai

# View logs
sudo journalctl -u viralai -f

# Run migrations
cd /home/viralai/viral-ai/backend
source venv/bin/activate
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### Frontend

```bash
# Restart frontend
pm2 restart viralai-frontend

# View logs
pm2 logs viralai-frontend

# Update and rebuild
cd /home/viralai/viral-ai/frontend
git pull
npm install
npm run build
pm2 restart viralai-frontend
```

### Database Backup

```bash
# Backup database
pg_dump -U viral_ai_user viral_ai_db > backup_$(date +%Y%m%d).sql

# Restore database
psql -U viral_ai_user viral_ai_db < backup_20251026.sql
```

---

## Troubleshooting

### Backend not starting
```bash
# Check service status
sudo systemctl status viralai

# Check logs
sudo journalctl -u viralai -n 50

# Test manually
cd /home/viralai/viral-ai/backend
source venv/bin/activate
gunicorn viral_ai.wsgi:application --bind 0.0.0.0:8000
```

### Frontend not loading
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs viralai-frontend

# Restart
pm2 restart viralai-frontend
```

### Database connection issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U viral_ai_user -d viral_ai_db -h localhost
```

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx/HAProxy)
- Multiple backend instances
- Shared PostgreSQL database
- Redis for session storage

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching
- Use CDN for static files

### Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Configure PostgreSQL for production
- Regular VACUUM and ANALYZE

---

## Monitoring & Logging

### Application Logs
- Backend: `/var/log/viralai/`
- Frontend: PM2 logs
- Nginx: `/var/log/nginx/`

### Monitoring Tools
- **Uptime:** UptimeRobot, Pingdom
- **Performance:** New Relic, DataDog
- **Errors:** Sentry
- **Server:** Prometheus + Grafana

---

## Backup Strategy

### Daily Backups
- Database dumps
- Media files
- Configuration files

### Weekly Backups
- Full system backup
- Off-site storage

### Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database
pg_dump -U viral_ai_user viral_ai_db > $BACKUP_DIR/db_$DATE.sql

# Media files
tar -czf $BACKUP_DIR/media_$DATE.tar.gz /home/viralai/viral-ai/backend/media/

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/db_$DATE.sql s3://viral-ai-backups/
aws s3 cp $BACKUP_DIR/media_$DATE.tar.gz s3://viral-ai-backups/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

---

## Summary

Your VIRAL.AI platform is now configured for deployment on **viral.ai-it.io**!

**Next Steps:**
1. Set up DNS records
2. Deploy backend to server
3. Deploy frontend to server
4. Configure Nginx
5. Install SSL certificate
6. Test all features
7. Set up monitoring
8. Configure backups

**Support:** For issues, check logs and troubleshooting section above.

🎉 **Happy Deploying!**
