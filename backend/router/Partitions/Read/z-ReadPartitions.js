const ReadPartitionsRouter = require("express").Router();
const { ReadMyPartitions } = require("./ReadMyPartitions");

ReadPartitionsRouter.use("/read", [ReadMyPartitions]);

ReadPartitionsRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown partitions create route");
});

module.exports = {
  ReadPartitionsRouter: ReadPartitionsRouter,
};
