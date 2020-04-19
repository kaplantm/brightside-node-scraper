"use strict";
const request = require("axios");
const { getPositionFromHTML } = require("./helpers");

module.exports.updateBrightsideInFirebase = async (event) => {
  return request("https://www.officialcharts.com/charts/")
    .then(({ data }) => {
      const result = getPositionFromHTML(data);
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
