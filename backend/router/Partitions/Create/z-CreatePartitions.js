const CreatePartitionsRouter = require("express").Router();
const { CreateOneQuote } = require("./CreateOnePartition");

CreatePartitionsRouter.use("/create", [CreateOneQuote]);

CreatePartitionsRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown partitions create route");
});

module.exports = {
  CreatePartitionsRouter: CreatePartitionsRouter,
};
