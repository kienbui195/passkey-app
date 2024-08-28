"use strict";

import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: "password",
    plugin: "password-field",
    type: "string",
    inputSize: {
      // optional
      default: 6,
      isResizable: true,
    },
  });
};
