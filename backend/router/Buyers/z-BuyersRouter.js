const buyersRouter = require("express").Router();
const { CreateBuyersRouter } = require("./Create/z-CreateBuyers");
const { ReadBuyersRouter } = require("./Read/z-ReadBuyers");

buyersRouter.use("/buyers", [CreateBuyersRouter,ReadBuyersRouter]);

buyersRouter.all("/buyers/*", (req, res) => {
  res.status(300).send({status:false,message:"Ruta de compradores inválida"});
});

module.exports = {
  buyersRouter: buyersRouter,
};
