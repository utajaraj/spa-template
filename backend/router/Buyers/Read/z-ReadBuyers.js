const ReadBuyersRouter = require("express").Router();
const { ReadBuyersClient } = require("./ReadBuyersClient");

ReadBuyersRouter.use("/read", [ReadBuyersClient]);

ReadBuyersRouter.all("/read", (req, res) => {

  res.status(300).send({status:false,message:"Ruta de leer compradores inválida"});
});

module.exports = {
  ReadBuyersRouter: ReadBuyersRouter,
};
