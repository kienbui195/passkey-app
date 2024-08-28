"use strict";

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: "password",
      plugin: "password-field",
      type: "text",
      inputSize: {
        // optional
        default: 6,
        isResizable: true,
      },
    });
  },
};
