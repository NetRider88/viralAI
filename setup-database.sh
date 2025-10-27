#!/bin/bash

# Database setup script for VIRAL.AI
# Run this on the GCP server

DB_NAME="viral_ai_production"
DB_USER="john"
DB_HOST="10.14.48.3"

# The password with special characters
export PGPASSWORD='7DMp`A"4tBbn92gS'

echo "Creating database: $DB_NAME"
psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
psql -h $DB_HOST -U $DB_USER -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "Creating database schema..."
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /home/john_aidnas_com/database-schema.sql

echo "Database setup complete!"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo "User: $DB_USER"
