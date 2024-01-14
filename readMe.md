Lambda function node webscraper that finds the position of Mr. Brightside in the [UK Official Charts](https://www.officialcharts.com/charts/) and publishes that data to an json file in an s3 bucket.


Using the [Serverless Framework](https://www.npmjs.com/package/serverless)


## Running locally

`npm install`
`sls invoke local -f handleUpdateBrightsideData`