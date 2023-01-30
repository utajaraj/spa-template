const CreateBrandsRouter = require("express").Router();
const { CreateOneBrand } = require("./CreateOneBrand");

CreateBrandsRouter.use("/create", [CreateOneBrand]);

CreateBrandsRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown marcas create route");
});

module.exports = {
  CreateBrandsRouter: CreateBrandsRouter,
};
