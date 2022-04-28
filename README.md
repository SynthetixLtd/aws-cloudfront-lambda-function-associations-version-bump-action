# aws-cloudfront-lambda-function-associations-version-bump-action

[GitHub Action](https://developer.github.com/actions/) for incrementing the lambda function ARN which is associatied with the targeted CloudFront distribution based on event type.

## Usage

```yaml
name: "Lambda@Edge Version Bump"

on:
  push:
    branches:
      - main

jobs:
  incrementing:
    runs-on: ubuntu-latest
    name: "Performing Version Bump"
    steps:
      - name: "Action Version Bump"
        id: bump
        uses: SynthetixLtd/aws-cloudfront-lambda-function-associations-version-bump-action@main
        with:
          DISTRIBUTION_ID: ${{ secrets.AWS_CDN_DISTRIBUTION_ID }}
          ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          EVENT_TYPE: "viewer-response"

      - name: "Associatied Function Infomation"
        run: echo "Associatied lambda function ARN now target version ${{ steps.bump.outputs.version }} of Lambda@Edge function"
```