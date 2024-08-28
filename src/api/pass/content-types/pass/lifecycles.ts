"use strict";
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");

module.exports = {
  async beforeFindMany(ev) {
    const ctx = strapi.requestContext.get();
    const { id } = ctx.state.user;
    let { params } = ev;
    params.where = {
      ...params.where,
      owner: {
        id,
      },
    };
  },

  async afterCreate(ev) {
    const ctx = strapi.requestContext.get();
    const { id } = ctx.state.user;
    const { result } = ev;

    await strapi.entityService.update("api::pass.pass", result.id, {
      data: {
        owner: {
          id,
        },
      },
    });
  },
};
