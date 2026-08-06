#!/bin/bash

echo "💾 Backing up database..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

docker exec khakadx-postgres pg_dump -U admin khakadx > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo "✅ Backup created: backup_$TIMESTAMP.sql"