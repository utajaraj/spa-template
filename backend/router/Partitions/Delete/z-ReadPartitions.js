const DeletePartitionsRouter = require("express").Router();
const { DeleteMyPartitions } = require("./DeleteMyPartitions");

DeletePartitionsRouter.use("/delete", [DeleteMyPartitions]);

DeletePartitionsRouter.all("/delete", (req, res) => {
  res.status(300).send({ status: false, message: "Unknown partitions delete route" });
});

module.exports = {
  DeletePartitionsRouter: DeletePartitionsRouter,
};
