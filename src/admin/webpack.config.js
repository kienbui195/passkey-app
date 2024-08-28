"use strict";

const webpack = require("webpack");
const path = require("path");

/* eslint-disable no-unused-vars */
module.exports = (config) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config
  config.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        BE_URL: JSON.stringify(process.env.BE_URL),
        APP_SECRET_KEY: JSON.stringify(process.env.APP_SECRET_KEY),
      },
    })
  );

  return config;
};
