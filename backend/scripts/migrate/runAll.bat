@echo off
REM Master migration script for Windows - runs all migrations in order

echo =========================================
echo Starting MongoDB to PostgreSQL Migration
echo =========================================
echo.

REM Check if .env exists
if not exist "..\..\env" (
    echo Error: .env file not found!
    exit /b 1
)

echo Step 1: Migrating Users...
call npx tsx migrateUsers.ts
if errorlevel 1 (
    echo User migration failed!
    exit /b 1
)
echo.

echo Step 2: Migrating Partners...
call npx tsx migratePartners.ts
if errorlevel 1 (
    echo Partner migration failed!
    exit /b 1
)
echo.

echo Step 3: Migrating Requirements...
call npx tsx migrateRequirements.ts
if errorlevel 1 (
    echo Requirement migration failed!
    exit /b 1
)
echo.

echo Step 4: Migrating Quotes...
call npx tsx migrateQuotes.ts
if errorlevel 1 (
    echo Quote migration failed!
    exit /b 1
)
echo.

echo =========================================
echo Migration Complete!
echo =========================================
echo.
echo Mapping files saved in: ..\mappings\
echo.
echo Next steps:
echo 1. Verify data in PostgreSQL
echo 2. Run validation tests
echo 3. Update controllers to use Prisma repositories
