from aws_cdk import (
    Stack,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3 as s3,
    CfnOutput
)
from constructs import Construct

class CloudFrontStack(Stack):
    def __init__(
        self, 
        scope: Construct, 
        construct_id: str, 
        environment: str,
        frontend_bucket: s3.Bucket,
        **kwargs
    ):
        super().__init__(scope, construct_id, **kwargs)
        
        prefix = f"testpy-{environment}"
        
        # Create CloudFront distribution with S3 origin (public access)
        distribution = cloudfront.Distribution(
            self, "FrontendDistribution",
            default_root_object="index.html",
            price_class=cloudfront.PriceClass.PRICE_CLASS_100,
            enabled=True,
            http_version=cloudfront.HttpVersion.HTTP2_AND_3,
            
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3BucketOrigin(frontend_bucket),
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cached_methods=cloudfront.CachedMethods.CACHE_GET_HEAD,
                compress=True,
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cache_policy=cloudfront.CachePolicy.CACHING_OPTIMIZED,
            ),
            
            # SSL certificate
            certificate=None,  # Using default certificate
            ssl_support_method=cloudfront.SSLMethod.SNI,
            minimum_protocol_version=cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021
        )
        
        # Outputs
        CfnOutput(self, "CloudFrontDistributionId", value=distribution.distribution_id)        
        CfnOutput(self, "CloudFrontDomainName", value=distribution.domain_name)