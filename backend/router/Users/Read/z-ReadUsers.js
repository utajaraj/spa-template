const ReadUsersRouter = require("express").Router();
const { ReadAllUsers } = require("./ReadAllUsers");
const {ReadAllUsersByRole} = require("./ReadAllUsersByRole");

ReadUsersRouter.use("/read", [ReadAllUsers,ReadAllUsersByRole]);

ReadUsersRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown users read route");
});

module.exports = {
  ReadUsersRouter: ReadUsersRouter,
};
