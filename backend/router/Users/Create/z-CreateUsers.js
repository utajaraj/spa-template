const CreateUsersRouter = require("express").Router();
const { CreateOneUser } = require("./CreateOneUser");

CreateUsersRouter.use("/create", [CreateOneUser]);

CreateUsersRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown users create route");
});

module.exports = {
  CreateUsersRouter: CreateUsersRouter,
};
