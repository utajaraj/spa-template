const CreateBuyersRouter = require("express").Router();
const { CreateOneBuyer } = require("./CreateOneBuyer");

CreateBuyersRouter.use("/create", [CreateOneBuyer]);

CreateBuyersRouter.all("/create", (req, res) => {
  res.status(300).send({status:false,message:"Ruta de crear compradores inválida"});
});

module.exports = {
  CreateBuyersRouter: CreateBuyersRouter,
};
