import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('password-field')
      .service('myService')
      .getWelcomeMessage();
  },
});
