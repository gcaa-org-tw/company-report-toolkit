#!/bin/bash

# Check if connection string is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <postgresql-connection-string>"
    exit 1
fi

# Get connection string from argument
CONNECTION_STRING="$1"

# Generate backup filename with current date
BACKUP_FILE="backup-$(date +%Y%m%d).sql"

# Create backup using pg_dump
echo "Creating backup: $BACKUP_FILE"
if pg_dump "$CONNECTION_STRING" > "$BACKUP_FILE"; then
    echo "Backup completed successfully"
    echo "Backup stored in: $BACKUP_FILE"
else
    echo "Backup failed"
    exit 1
fi