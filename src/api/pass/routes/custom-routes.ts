module.exports = {
  routes: [
    {
      method: "POST",
      path: "/vu/:id",
      handler: "pass.verifyUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
