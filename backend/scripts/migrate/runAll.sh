#!/bin/bash

# Master migration script - runs all migrations in order

echo "========================================="
echo "Starting MongoDB to PostgreSQL Migration"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f "../../.env" ]; then
    echo "Error: .env file not found!"
    exit 1
fi

# Create mappings directory if it doesn't exist
mkdir -p ../mappings

echo "Step 1: Migrating Users..."
npx tsx migrateUsers.ts
if [ $? -ne 0 ]; then
    echo "User migration failed!"
    exit 1
fi
echo ""

echo "Step 2: Migrating Partners..."
npx tsx migratePartners.ts
if [ $? -ne 0 ]; then
    echo "Partner migration failed!"
    exit 1
fi
echo ""

echo "Step 3: Migrating Requirements..."
npx tsx migrateRequirements.ts
if [ $? -ne 0 ]; then
    echo "Requirement migration failed!"
    exit 1
fi
echo ""

echo "Step 4: Migrating Quotes..."
npx tsx migrateQuotes.ts
if [ $? -ne 0 ]; then
    echo "Quote migration failed!"
    exit 1
fi
echo ""

echo "========================================="
echo "Migration Complete!"
echo "========================================="
echo ""
echo "Mapping files saved in: ../mappings/"
echo ""
echo "Next steps:"
echo "1. Verify data in PostgreSQL"
echo "2. Run validation tests"
echo "3. Update controllers to use Prisma repositories"
