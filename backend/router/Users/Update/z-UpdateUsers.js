const UpdateUsersRouter = require("express").Router();
const { UpdateUsers } = require("./UpdateUsers");

UpdateUsersRouter.use("/update", [UpdateUsers]);

UpdateUsersRouter.all("/update", (req, res) => {
    res.status(300).send("Unknown users update route");
});

module.exports = {
    UpdateUsersRouter: UpdateUsersRouter,
};
