@echo off
for /d %%D in (*) do (
    aws s3 cp "%%D" "s3://tnsaino-demobucket/version/%%D/" --recursive
)
for %%F in (*) do (
    if /i not "%%~xF"==".bat" (
        aws s3 cp "%%F" "s3://tnsaino-demobucket/version/%%F"
    )
)
echo Done.

call aws cloudfront create-invalidation-for-distribution-tenant --id dt_3A1w0kTvIO5IYFeeRksrnxixNdB --invalidation-batch "Paths={Quantity=1,Items=[/*]},CallerReference=$(date +%s)"