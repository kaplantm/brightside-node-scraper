"use strict";
const request = require("axios");
const admin = require("firebase-admin");

const { getPositionFromHTML } = require("./helpers");

const serviceAccount = require("./serviceAccountKey.json");

module.exports.updateBrightsideInFirebase = async (event) => {
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mrbrightside-f7929.firebaseio.com",
  });
  return request("https://www.officialcharts.com/charts/")
    .then(({ data }) => {
      const result = getPositionFromHTML(data, admin, app);
      console.log({ result });
      return {
        statusCode: 200,
        body: result,
      };
    })
    .catch((error) => ({
      statusCode: 500,
      body: {
        message: "An error occurred.",
        error,
      },
    }));
};
