const ReadBrandsRouter = require("express").Router();
const { ReadBrands } = require("./ReadBrands");

ReadBrandsRouter.use("/read", [ReadBrands]);

ReadBrandsRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown marcas create route");
});

module.exports = {
  ReadBrandsRouter: ReadBrandsRouter,
};
