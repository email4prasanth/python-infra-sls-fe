from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_iam as iam,
    RemovalPolicy,
    CfnOutput
)

from constructs import Construct
import importlib
from types import SimpleNamespace
import os

class S3Stack(Stack):
    # def load_config(self, env: str):
    #     try:
    #         module = importlib.import_module(f"frontend-infra.config.{env}")
    #         return SimpleNamespace(**vars(module))
    #     except ModuleNotFoundError:
    #         raise ValueError(f"Configuration for {env} not found")

    def __init__(self, scope: Construct, construct_id: str, environment: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)
        # config = self.load_config(environment)
        prefix = f"testpy-{environment}"

        # Create S3 bucket for frontend
        bucket_name = f"{prefix}-frontend"
        self.frontend_bucket = s3.Bucket(
            self, "FrontendBucket",
            bucket_name=bucket_name,
            versioned=False,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            website_index_document="index.html",
            website_error_document="error.html",
            block_public_access=s3.BlockPublicAccess(
                block_public_acls=False,
                block_public_policy=False,
                ignore_public_acls=False,
                restrict_public_buckets=False
            ),
            cors=[s3.CorsRule(
                allowed_headers=["*"],
                allowed_methods=[
                    s3.HttpMethods.GET,
                    s3.HttpMethods.PUT,
                    s3.HttpMethods.POST,
                    s3.HttpMethods.DELETE,
                    s3.HttpMethods.HEAD
                ],
                allowed_origins=["*"],
                exposed_headers=["ETag"],
                max_age=3000
            )]
        )

        # Create CloudFront Origin Access Identity
        self.oai = cloudfront.OriginAccessIdentity(
            self, "FrontendOAI",
            comment=f"OAI for {bucket_name}"
        )

        # Create bucket policy
        bucket_policy = iam.PolicyStatement(
            effect=iam.Effect.ALLOW,
            actions=["s3:*"],
            principals=[iam.CanonicalUserPrincipal(self.oai.cloud_front_origin_access_identity_s3_canonical_user_id)],
            resources=[
                self.frontend_bucket.bucket_arn,
                f"{self.frontend_bucket.bucket_arn}/*"
            ]
        )
        

        self.frontend_bucket.add_to_resource_policy(bucket_policy)

        # Outputs
        CfnOutput(self, "FrontendBucketName", value=self.frontend_bucket.bucket_name)
        CfnOutput(self, "FrontendWebsiteURL", value=self.frontend_bucket.bucket_website_url)
        CfnOutput(self, "OAIId", value=self.oai.origin_access_identity_id)
        CfnOutput(self, "OAICanonicalUserId", value=self.oai.cloud_front_origin_access_identity_s3_canonical_user_id)
