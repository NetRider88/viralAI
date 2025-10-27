#!/bin/bash

# Nginx configuration for VIRAL.AI

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/viral.ai-it.io > /dev/null <<'NGINXEOF'
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

    # Frontend (Next.js) - fallback to Django for now
    location / {
        proxy_pass http://unix:/home/john_aidnas_com/viral-ai/backend/viral-ai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

echo -e "${GREEN}Enabling Nginx site...${NC}"
sudo ln -sf /etc/nginx/sites-available/viral.ai-it.io /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo -e "${GREEN}Installing SSL certificate...${NC}"
sudo certbot --nginx -d viral.ai-it.io -d www.viral.ai-it.io --non-interactive --agree-tos --email john@ai-it.io || echo "SSL setup failed or already configured"

echo -e "${GREEN}Nginx setup complete!${NC}"
echo "Visit: https://viral.ai-it.io"
