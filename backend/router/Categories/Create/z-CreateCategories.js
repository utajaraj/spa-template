const CreateCategoriesRouter = require("express").Router();
const { CreateOneQuote } = require("./CreateOneCategory");

CreateCategoriesRouter.use("/create", [CreateOneQuote]);

CreateCategoriesRouter.all("/create", (req, res) => {
  res.status(300).send("Unknown categories create route");
});

module.exports = {
  CreateCategoriesRouter: CreateCategoriesRouter,
};
