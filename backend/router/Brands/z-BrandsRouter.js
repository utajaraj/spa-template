const BrandsRouter = require("express").Router();
const { CreateBrandsRouter } = require("./Create/z-CreateBrands");
const { ReadBrandsRouter } = require("./Read/z-ReadBrands");

BrandsRouter.use("/brands", [CreateBrandsRouter,ReadBrandsRouter]);

BrandsRouter.all("/brands/*", (req, res) => {
  res.status(300).send("Unknown users route");
});

module.exports = {
  BrandsRouter: BrandsRouter,
};
