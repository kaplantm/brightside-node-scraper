"use strict";
const request = require("axios");
const S3 = require("./lib/aws-s3-client.js");
const { getPositionFromHTML } = require("./helpers");

const s3Client = new S3.S3Client(
  process.env.ACCESS_KEY_ID,
  process.env.SECRET_ACCESS_KEY
);

module.exports.updateBrightsideData = async (event) => {
  try {
    return await request("https://www.officialcharts.com/charts/").then(
      async ({ data }) => {
        const result = getPositionFromHTML(data);
        const stringifiedResult = JSON.stringify({
          ...result,
          updated_at: new Date().getTime(),
        });
        const s3PutRequest = s3Client.createPutPublicJsonRequest(
          "ismrbrightsidestillintheukcharts.com/assets",
          "brightside.json",
          stringifiedResult
        );
        const s3Response = await s3Client.put(s3PutRequest);

        console.log({ response: stringifiedResult, type: "success" });

        return {
          statusCode: 200,
          headers: {},
          body: stringifiedResult,
          isBase64Encoded: false,
        };
      }
    );
  } catch (error) {
    const body = {
      message: "An error occurred.",
      error,
    };
    console.log({ response: body, type: "error" });
    return {
      statusCode: 500,
      headers: {},
      body: JSON.stringify(body),
      isBase64Encoded: false,
    };
  }
};
