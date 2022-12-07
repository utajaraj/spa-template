const UsersRouter = require("express").Router();
const { CreateUsersRouter } = require("./Create/z-CreateUsers");
const { ReadUsersRouter } = require("./Read/z-ReadUsers");

UsersRouter.use("/users", [ReadUsersRouter,CreateUsersRouter]);

UsersRouter.all("/users/*", (req, res) => {
  res.status(300).send("Unknown users route");
});

module.exports = {
  UsersRouter: UsersRouter,
};
