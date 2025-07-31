### python-infra Intial setup
- The main aim to create aws infra strcture ec2.

#### Phase-1 deploying infra without using CICD
- Prerequisite:
- AWS Account
- User in IAM, set the credentials in profile and config.
- check AWS CLI, node, AWS CDK, Python --version, if require install and add in the envrionment varibiales.
- Install boto3 
- check the postgres version using 
```sh
aws rds describe-db-engine-versions --default-only --engine postgres
```
```sh
aws --version
node --version
npm --version
npm install -g aws-cdk
cdk --version
python --version
# Create folder structure
mkdir frontend-infra && cd frontend-infra
cdk init sample-app --language python

cd frontend-infra
New-Item -Path "config\__init__.py" -ItemType File -Force
New-Item -Path "config\dev.py" -ItemType File -Force
New-Item -Path "config\prod.py" -ItemType File -Force
cd ..
.\.venv\Scripts\Activate.ps1 (intial requirement)
cdk bootstrap aws://180294218712/us-east-1 --profile tut
        # CDKToolkit: creating CloudFormation changeset...
        #  1/12 | AWS::SSM::Parameter        
        #  2/12 | AWS::ECR::Repository       
        #  3/12 | AWS::S3::Bucket            
        #  4/12 | AWS::S3::BucketPolicy      
        #  5/12 | AWS::IAM::Role             
        #  6/12 | AWS::IAM::Role             
        #  7/12 | AWS::IAM::Role             
        #  8/12 | AWS::IAM::Role             
        #  9/12 | AWS::IAM::Policy           
        # 10/12 | AWS::IAM::Policy           
        # 11/12 | AWS::IAM::Role             
        # 12/12 | AWS::CloudFormation::Stack 
# update requirement.txt
pip install -r requirements.txt
python -m pip show aws-cdk-lib
python -m pip show constructs
deactivate
```
- Add the necessary files change frontend_infa_stack.py to s3_stack.py 
```sh
.\.venv\Scripts\Activate.ps1
cd frontend-infra
cdk synth -c env=dev --profile tut --region us-east-1
cdk deploy --all --profile tut -c env=dev
cdk destroy --all --profile tut -c env=dev --force
aws cloudformation delete-stack --stack-name CDKToolkit --profile tut
deactivate
cd ..
aws s3 ls --profile tut --region us-east-1
.\z-delete-cdk-buckets.ps1
aws s3 ls --profile tut --region us-east-1
```
### usefull links
```sh
--------lambda and api------------
https://www.youtube.com/watch?v=o3s4VqlMsT8
https://docs.aws.amazon.com/cdk/api/v2/python/
```

### python infra creation and testing after a git pull
- When the code is pushed to the git repo the venv and cdk.out are ignored.
- After git pull is taken run the following commands where venv does not comes into picture
- Deployment Process
```sh
cd .\frontend-infra\
cdk bootstrap aws://180294218712/us-east-1 --profile tut
cdk deploy --all --profile tut -c env=dev --require-approval never
        # # If You Want to Deploy Only One Stack
        # # Deploy only VPC stack
        # cdk deploy VPCStack-dev --profile tut -c env=dev
        # # Deploy only Security Group stack (after VPC exists)
        # cdk deploy SecurityGroupStack-dev --profile tut -c env=dev
cdk deploy --all --profile tut -c env=dev (No duplicates are allowed)
cdk destroy --all --profile tut -c env=dev --force
aws cloudformation delete-stack --stack-name CDKToolkit --profile tut
cd ..
.\z-delete-cdk-buckets.ps1
aws s3 ls --profile tut --region us-east-1
```
#### Phase-2 deploying infra using CICD
- Prerequisite:
- Update the AWS Credentials in CICD Repository secrets
- Remove the aws profile related details if any.
- Powershell realated files should be replaced with bash code.
- specify the environment
- Create infra
- To update secrets without using Lambda by using the **AWS Custom Resource** directly with the Secrets Manager SDK call
```sh
name: Set up Python
name: Set up Node.js
name: Instal AWS CDK
name: Configure AWS Credentials
name: Install Python dependencies
name: Bootstrap CDK
name: CDK Synth
name: CDK Deploy
```
- Destroy Infra
```sh
Checkout Repository
Set up Python
Set up Node.js
Instal AWS CDK
Configure AWS Credentials
Install Python dependencies
CDK Destroy frontend-infra
Destroy CDK Bootstrap Stack
Remove S3 bucket
```
