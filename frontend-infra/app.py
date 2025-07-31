
import aws_cdk as cdk
from frontend_infra.s3_stack import S3Stack
from frontend_infra.cloudfront_stack import CloudFrontStack

app = cdk.App()
env_name = app.node.try_get_context("env") or "dev"
prefix = f"testpy-{env_name}"

# Create S3 stack
s3_stack = S3Stack(
    app, 
    f"{prefix}-s3",
    environment=env_name,
    env=cdk.Environment(account='180294218712', region='us-east-1')
)

# Create CloudFront stack
CloudFrontStack(
    app,
    f"{prefix}-cloudfront",
    environment=env_name,
    frontend_bucket=s3_stack.frontend_bucket,
    env=cdk.Environment(account='180294218712', region='us-east-1')
)

# Optional: Create WAF stack
# waf_stack = WafStack(
#     app,
#     f"{prefix}-waf",
#     env=cdk.Environment(account='180294218712', region='us-east-1')
# )

app.synth()