@echo off
REM Batch script to backup S3 bucket contents to local storage with date/time folder

setlocal enabledelayedexpansion

REM Get current date and time in format: YYYY-MM-DD_HH-MM-SS
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a-%%b)
set timestamp=!mydate!_!mytime!

REM Set variables
set S3_BUCKET=s3://tnsainouser-demobucket
set BACKUP_DIR=%~dp0backup
set TIMESTAMPED_DIR=!BACKUP_DIR!\!timestamp!

echo.
echo ========================================
echo S3 Backup Script
echo ========================================
echo.
echo S3 Bucket: %S3_BUCKET%
echo Backup Directory: !BACKUP_DIR!
echo Timestamped Directory: !TIMESTAMPED_DIR!
echo Timestamp: !timestamp!
echo.

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: AWS CLI is not installed or not in PATH
    echo Please install AWS CLI and configure your credentials
    echo Visit: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Check if credentials are configured
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ERROR: AWS credentials are not configured
    echo Please run: aws configure
    pause
    exit /b 1
)

REM Create backup directory if it doesn't exist
if not exist "!BACKUP_DIR!" (
    echo Creating backup directory...
    mkdir "!BACKUP_DIR!"
)

REM Create timestamped directory
echo Creating timestamped directory: !timestamp!
mkdir "!TIMESTAMPED_DIR!"
if errorlevel 1 (
    echo ERROR: Failed to create timestamped directory
    pause
    exit /b 1
)

REM Sync S3 bucket to timestamped directory, excluding backup folder
echo.
echo Starting S3 sync (excluding backup directory)...
echo.

aws s3 sync %S3_BUCKET% "!TIMESTAMPED_DIR!" ^
    --exclude "backup/*" ^
    --exclude ".backup/*" ^
    --delete

if errorlevel 1 (
    echo.
    echo ERROR: S3 sync failed
    echo The timestamped directory may be incomplete
    pause
    exit /b 1
)

echo.
echo ========================================
echo Backup completed successfully!
echo ========================================
echo.
echo Backup Location: !TIMESTAMPED_DIR!
echo.

REM Upload dist folder contents to S3
echo.
echo ========================================
echo Uploading dist folder to S3...
echo ========================================
echo.

set DIST_DIR=%~dp0dist

if not exist "!DIST_DIR!" (
    echo WARNING: dist directory not found at: !DIST_DIR!
    echo Skipping S3 upload
    goto :end_upload
)

echo Uploading from: !DIST_DIR!
echo Uploading to: %S3_BUCKET%
echo.

aws s3 sync "!DIST_DIR!" %S3_BUCKET% ^
    --exclude ".git*" ^
    --exclude "node_modules/*" ^
    --exclude ".env*" ^
    --delete

if errorlevel 1 (
    echo.
    echo ERROR: S3 upload failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo S3 upload completed successfully!
echo ========================================
echo.
echo Uploaded to: %S3_BUCKET%
echo.

:end_upload
echo To restore backup in the future:
echo   aws s3 sync "!TIMESTAMPED_DIR!" %S3_BUCKET% --delete
echo.
pause
exit /b 0
