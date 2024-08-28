import { decryptPassword } from "./../../../plugins/password-field/admin/src/utils/function";
import bcrypt from "bcryptjs";
/**
 * pass controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::pass.pass",
  ({ strapi }) => ({
    async verifyUser(ctx) {
      try {
        const { id: passEntryId } = ctx.params;
        const { pass } = ctx.request.body.data;
        const [adminId, adminPass] = pass.split(
          `/%${process.env.APP_SECRET_KEY.substring(0, 3)}/%`
        );

        const passEntry = await strapi.db.query("api::pass.pass").findOne({
          populate: {
            owner: {
              select: ["id", "isActive", "blocked"],
            },
          },
          where: {
            owner: {
              id: adminId,
            },
            id: passEntryId,
          },
          select: ["id", "password"],
        });

        if (
          !passEntry ||
          !passEntry.owner.isActive ||
          passEntry.owner.blocked
        ) {
          return ctx.send({ status: false });
        }

        const adminPassDecrypt = decryptPassword(adminPass);
        const isMatch = await bcrypt.compare(
          adminPassDecrypt,
          passEntry.password
        );

        if (isMatch) {
          return ctx.send({ status: true });
        }

        return ctx.send({
          status: false,
        });
      } catch (error) {
        console.log("[pass.controller.verifyUser]: ", error.message);
        return ctx.badRequest(error);
      }
    },
  })
);
