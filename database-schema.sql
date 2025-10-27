-- VIRAL.AI Database Schema
-- Database: viral_ai_production
-- Created: October 27, 2025

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'active',
    stripe_customer_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    content_blocks_created INTEGER DEFAULT 0,
    video_generations INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    UNIQUE(user_id, month)
);

-- Keyword Research
CREATE TABLE keyword_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    country VARCHAR(10) DEFAULT 'us',
    language VARCHAR(10) DEFAULT 'en',
    search_volume INTEGER,
    platform_breakdown JSONB,
    questions JSONB,
    prepositions JSONB,
    alphabetical JSONB,
    related_keywords JSONB,
    viral_examples JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Content Blocks
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keyword_research(id),
    title VARCHAR(500) NOT NULL,
    keyword VARCHAR(255),
    niche VARCHAR(100),
    content_angle VARCHAR(100),
    tone VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Platform Content
CREATE TABLE platform_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    content_type VARCHAR(100),
    caption TEXT,
    hashtags TEXT[],
    content_data JSONB,
    images JSONB,
    video_script TEXT,
    trackable_link VARCHAR(500),
    posted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Trackable Links
CREATE TABLE trackable_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_block_id UUID REFERENCES content_blocks(id),
    platform VARCHAR(50),
    short_code VARCHAR(50) UNIQUE NOT NULL,
    destination_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Link Analytics
CREATE TABLE link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES trackable_links(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(10),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    clicked_at TIMESTAMP DEFAULT NOW()
);

-- Platform Analytics
CREATE TABLE platform_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_content_id UUID REFERENCES platform_content(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_value INTEGER,
    metric_data JSONB,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Brand Kits
CREATE TABLE brand_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    colors JSONB,
    fonts JSONB,
    watermark_settings JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Image Library
CREATE TABLE image_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    folder VARCHAR(255),
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members (Pro/Agency)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    member_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    permissions JSONB,
    invited_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_owner_id, member_user_id)
);

-- Platform Connections
CREATE TABLE platform_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    platform_user_id VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    connected_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_keyword_research_user_id ON keyword_research(user_id);
CREATE INDEX idx_keyword_research_keyword ON keyword_research(keyword);
CREATE INDEX idx_content_blocks_user_id ON content_blocks(user_id);
CREATE INDEX idx_trackable_links_short_code ON trackable_links(short_code);
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_platform_content_content_block_id ON platform_content(content_block_id);
