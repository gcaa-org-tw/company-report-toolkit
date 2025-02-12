#!/bin/bash

# Check arguments
if [ $# -ne 2 ]; then
    echo "Usage: $0 <postgresql-connection-string> <backup-file>"
    exit 1
fi

CONNECTION_STRING="$1"
BACKUP_FILE="$2"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Restoring from: $BACKUP_FILE"

# Handle compressed or uncompressed backups
if [[ "$BACKUP_FILE" == *.gz ]]; then
    if gunzip -c "$BACKUP_FILE" | psql "$CONNECTION_STRING"; then
        echo "Restore completed successfully"
    else
        echo "Restore failed"
        exit 1
    fi
else
    if psql "$CONNECTION_STRING" < "$BACKUP_FILE"; then
        echo "Restore completed successfully"
    else
        echo "Restore failed"
        exit 1
    fi
fi