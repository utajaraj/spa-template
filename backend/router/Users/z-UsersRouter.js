const UsersRouter = require("express").Router();
const { CreateUsersRouter } = require("./Create/z-CreateUsers");
const { ReadUsersRouter } = require("./Read/z-ReadUsers");
const { UpdateUsersRouter } = require("./Update/z-UpdateUsers");

UsersRouter.use("/users", [ReadUsersRouter, CreateUsersRouter, UpdateUsersRouter]);

UsersRouter.all("/users/*", (req, res) => {
  res.status(300).send("Unknown users route");
});

module.exports = {
  UsersRouter: UsersRouter,
};
