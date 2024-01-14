"use strict";
const { updateBrightsideData } = require("./lib/helper.js");

module.exports.handleUpdateBrightsideData = async (event) => {
  const response = await updateBrightsideData()
  console.log({ response })
  return response;
};
