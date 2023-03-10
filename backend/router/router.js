const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).send("Live");
})

const paths = [
  "./Users/z-UsersRouter.js",
  "./Quotes/z-QuotesRouter.js",
  "./Clients/z-ClientsRouter.js",
  "./Buyers/z-BuyersRouter.js",
  "./Partitions/z-PartitionsRouter.js",
  "./Brands/z-BrandsRouter.js",
  "./Categories/z-CategoriesRouter.js",
  "./CompanySites/z-CompanySitesRouter.js",
  "./Companies/z-CompaniesRouter.js",
].map((route) => {
  const r = require(route);
  return r[Object.keys(r)[0]];
})

router.use("/", paths);

router.all("*", (req, res) => {
  res.status(300).send("Unknown API route");
});

module.exports = {
  routes: router,
};
