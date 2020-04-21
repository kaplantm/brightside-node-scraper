https://firebase.google.com/docs/web/setup?authuser=0
https://firebase.google.com/docs/database/web/start?authuser=0

https://stackoverflow.com/questions/37403747/firebase-permission-denied
https://firebase.google.com/docs/auth/?authuser=0 (enabled anonymous auth)

export GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
export GOOGLE_APPLICATION_CREDENTIALS="/Users/tonikaplan/brightside-scraper-node/serviceAccountKey.json"

export ENV=dev

Serverless: Stack update finished...
Service Information
service: brightside-scraper-node
stage: dev
region: us-east-1
stack: brightside-scraper-node-dev
resources: 6
api keys:
None
endpoints:
None
functions:
updateBrightsideInFirebase: brightside-scraper-node-dev-updateBrightsideInFirebase
layers:
None
Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.

brightside-scraper-node-dev-updateBrightsideInFirebase

https://1uqnvk9yy3.execute-api.us-east-1.amazonaws.com/api/charts/singles?artist=Killers&title=Mr%20Brightside

https://dev.to/paulchiu/how-to-upload-json-data-to-aws-s3-with-nodejs-aws-sdk-and-typescript-53di

serverless invoke local --function updateBrightsideData
