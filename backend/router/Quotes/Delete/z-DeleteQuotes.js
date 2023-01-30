const DeleteQuotesRouter = require("express").Router();
const { DeleteOneQuote } = require("./DeleteOneQuote");

DeleteQuotesRouter.use("/delete", [DeleteOneQuote]);

DeleteQuotesRouter.all("/delete", (req, res) => {
  res.status(300).send({status:false,message:"Ruta de actualizar cotizaciones desconocida"});
});

module.exports = {
  DeleteQuotesRouter: DeleteQuotesRouter,
};
