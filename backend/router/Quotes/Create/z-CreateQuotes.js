const CreateQuotesRouter = require("express").Router();
const { CreateOneQuote } = require("./CreateOneQuote");

CreateQuotesRouter.use("/create", [CreateOneQuote]);

CreateQuotesRouter.all("/create", (req, res) => {
  res.status(300).send({status:false,message:"Ruta de crear cotizaciones desconocida"});
});

module.exports = {
  CreateQuotesRouter: CreateQuotesRouter,
};
