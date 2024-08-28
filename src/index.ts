export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    async function decryptPassword(encryptPass: string) {
      const bytes = CryptoJS.AES.decrypt(
        encryptPass,
        process.env.APP_SECRET_KEY
      );
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  },
};
