@echo off
setlocal enabledelayedexpansion

:: Get current date and time formatted as YYYY-MM-DD_HH-MM-SS
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "dt=%%I"
set "timestamp=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%_%dt:~8,2%-%dt:~10,2%-%dt:~12,2%"

set "BUCKET=tnsaino-prod-demobucket"
set "BACKUP_BUCKET=elantium-website-backups"
set "DEST_DIR=backup/%timestamp%"
set "DEST_EXCLUDE=%BACKUP_BUCKET%/%DEST_DIR%/*"
set "INVALIDATION_REF=invalidate-%dt:~0,14%-%dt:~15,3%-%random%"

echo Copying objects in s3://%BUCKET%/ to s3://%BACKUP_BUCKET%/%DEST_DIR%/

aws s3 cp "s3://%BUCKET%/" "s3://%BACKUP_BUCKET%/%DEST_DIR%/" --recursive

echo Done. Objects copied to s3://%BACKUP_BUCKET%/%DEST_DIR%/

echo Deleting objects in s3://%BUCKET%/

aws s3 rm "s3://%BUCKET%/" --recursive

echo Done. Objects deleted from s3://%BUCKET%/

echo Copying dist folder to s3://%BUCKET%/

aws s3 cp "v4/" "s3://%BUCKET%/" --recursive

echo Done. dist folder copied to s3://%BUCKET%/

set "DISTRIBUTION_ID=E3TXEUUNMMW5P3"
set "TENANT_ID=dt_3BJLyuj79m0vinBMIVRjcDfZ5k0"

if "%TENANT_ID%"=="" (
    echo ERROR: Tenant ID is required. Usage: move-s3-objects.bat ^<tenant-id^>
    exit /b 1
)

echo Creating CloudFront invalidation for tenant %TENANT_ID% on distribution %DISTRIBUTION_ID%...

    REM aws cloudfront create-invalidation --distribution-id %DISTRIBUTION_ID% --paths "/index.html" --distribution-tenant-id %TENANT_ID%
    REM aws cloudfront create-invalidation-for-distribution-tenant --id %TENANT_ID% --invalidation-batch "{ \"Paths\": { \"Quantity\": 1, \"Items\": [\"/*\"] }, \"CallerReference\": \"%INVALIDATION_REF%\" }"


    aws cloudfront create-invalidation-for-distribution-tenant --id %TENANT_ID% --invalidation-batch "{ \"Paths\": { \"Quantity\": 1, \"Items\": [\"/index.html\"] }, \"CallerReference\": \"%INVALIDATION_REF%\" }"
    
echo Done. CloudFront invalidation created for tenant %TENANT_ID%.
