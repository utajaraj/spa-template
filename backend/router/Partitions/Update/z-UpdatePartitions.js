const UpdatePartitionsRouter = require("express").Router();
const { UpdateOneQuote } = require("./UpdateOnePartition");

UpdatePartitionsRouter.use("/update", [UpdateOneQuote]);

UpdatePartitionsRouter.all("/update", (req, res) => {
  res.status(300).send("Unknown partitions update route");
});

module.exports = {
  UpdatePartitionsRouter: UpdatePartitionsRouter,
};
