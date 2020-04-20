"use strict";
const request = require("axios");
const admin = require("firebase-admin");

const { getPositionFromHTML } = require("./helpers");
let app;
let database;

function initApp() {
  if (!app || app.isDeleted_) {
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://mrbrightside-f7929.firebaseio.com",
    });
    // admin.database.enableLogging(true);
    database = admin.database();
  }
}

module.exports.updateBrightsideInFirebase = async (event) => {
  initApp();
  return request("https://www.officialcharts.com/charts/")
    .then(({ data }) => {
      const result = getPositionFromHTML(data, database, app);
      console.log({ result });
      return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(result),
        isBase64Encoded: false,
      };
    })
    .catch((error) => {
      console.log({ error });
      return {
        body: {
          statusCode: 200,
          headers: {},
          body: JSON.stringify({
            message: "An error occurred.",
            error,
          }),
          isBase64Encoded: false,
        },
      };
    });
};
