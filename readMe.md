Lambda function node webscraper that finds the position of Mr. Brightside in the [UK Official Charts](https://www.officialcharts.com/charts/) and publishes that data to an json file in an s3 bucket.


Using the [Serverless Framework](https://www.npmjs.com/package/serverless)


## Running locally

`npm install`
`sls invoke local -f handleUpdateBrightsideData`

writing to AWS will fail unless you have configured the AWS CLI with the correct Access Key ID and Secret Access Key. These are saved in 1Password, search "AWS access key for comics & mr brightside".

# Deployment
Make sure things are working locally (your AWS credentials are fully setup)
`sls deploy`

sls deploy will update the lambda function, which includes the html written to the index page on reach run.
to update the CSS for the page, you will need to upload the css to the [S3 bucket directly](https://s3.console.aws.amazon.com/s3/buckets/ismrbrightsidestillintheukcharts.com?region=us-east-1&bucketType=general). In the future a script could be added to this repo to deploy the lambda & push the css to s3.