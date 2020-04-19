"use strict";
const request = require("axios");
const admin = require("firebase-admin");

const { getPositionFromHTML } = require("./helpers");

const serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mrbrightside-f7929.firebaseio.com",
});

module.exports.updateBrightsideInFirebase = async (event) => {
  return request("https://www.officialcharts.com/charts/")
    .then(({ data }) => {
      const result = getPositionFromHTML(data, admin, app);
      return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(result),
        isBase64Encoded: false,
      };
    })
    .catch((error) => ({
      body: {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({
          message: "An error occurred.",
          error,
        }),
        isBase64Encoded: false,
      },
    }));
};
