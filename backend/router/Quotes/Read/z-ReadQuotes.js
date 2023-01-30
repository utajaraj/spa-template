const ReadQuotesRouter = require("express").Router();
const { ReadMyQuotes } = require("./ReadMyQuotes");

ReadQuotesRouter.use("/read", [ReadMyQuotes]);

ReadQuotesRouter.all("/read", (req, res) => {
  res.status(300).send({ status: false, message: "Ruta de leer cotizaciones desconocida" });
});

module.exports = {
  ReadQuotesRouter: ReadQuotesRouter,
};
