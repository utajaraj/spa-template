const PartitionsRouter = require("express").Router();
const { CreatePartitionsRouter } = require("./Create/z-CreatePartitions");
const { DeletePartitionsRouter } = require("./Delete/z-ReadPartitions");
const { ReadPartitionsRouter } = require("./Read/z-ReadPartitions");

PartitionsRouter.use("/partitions", [CreatePartitionsRouter, ReadPartitionsRouter, DeletePartitionsRouter]);

PartitionsRouter.all("/partitions/*", (req, res) => {
  res.status(300).send({ status: false, message: "Unknown partitions route" });
});

module.exports = {
  PartitionsRouter: PartitionsRouter,
};
