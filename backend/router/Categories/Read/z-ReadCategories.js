const ReadCategoriesRouter = require("express").Router();
const { ReadMyCategories } = require("./ReadMyCategories");

ReadCategoriesRouter.use("/read", [ReadMyCategories]);

ReadCategoriesRouter.all("/read", (req, res) => {
  res.status(300).send("Unknown categorias create route");
});

module.exports = {
  ReadCategoriesRouter: ReadCategoriesRouter,
};
