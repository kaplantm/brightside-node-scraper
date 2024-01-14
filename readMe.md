Lambda function node webscraper that finds the position of Mr. Brightside in the [UK Official Charts](https://www.officialcharts.com/charts/) and publishes that data to an json file in an s3 bucket.


Using the [Serverless Framework](https://www.npmjs.com/package/serverless)


## Running locally

`npm install`
`sls invoke local -f handleUpdateBrightsideData`

writing to AWS will fail unless you have configured the AWS CLI with the correct Access Key ID and Secret Access Key. These are saved in 1Password, search "AWS access key for comics & mr brightside".

# Deployment
Make sure things are working locally (your AWS credentials are fully setup).
`sls deploy`