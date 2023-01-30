const updateQuotesRouter = require("express").Router();
const { SubmitMyPartitions } = require("./SubmitOneQuote");
const { UpdateOneQuote } = require("./UpdateOneQuote");

updateQuotesRouter.use("/update", [UpdateOneQuote, SubmitMyPartitions]);

updateQuotesRouter.all("/update", (req, res) => {
  res.status(300).send({status:false,message:"Ruta de actualizar cotizaciones desconocida"});
});

module.exports = {
  updateQuotesRouter: updateQuotesRouter,
};
