const CategoriesRouter = require("express").Router();
const { CreateCategoriesRouter } = require("./Create/z-CreateCategories");
const { ReadCategoriesRouter } = require("./Read/z-ReadCategories");

CategoriesRouter.use("/categories", [CreateCategoriesRouter,ReadCategoriesRouter]);

CategoriesRouter.all("/categories/*", (req, res) => {
  res.status(300).send("Unknown categorias route");
});

module.exports = {
  CategoriesRouter: CategoriesRouter,
};
