const { knex } = require("../../../database/connection");
const { AddOnePartitionsValidation } = require("./UpdateOnePartition.Validation");


const UpdateOneQuote = require("express").Router();



UpdateOneQuote.patch("/status", async (req, res) => {
    try {

        if(Number.isInteger(req.body.id) && ["Abierta","Requerida", "No Requerida", "Adquisición", "Stock", "Tránsito", "Entregado", "En Tienda","Retraso","Lento Movimiento","Sin Cliente"].includes(req.body.status)){

            knex("partitions").update({status:req.body.status}).where({id:req.body.id}).then(async (e) => {
    
   
    
                res.status(200).send({ status: true, message: "Partida actualizada" })
    
            }).catch((err) => {
                res.status(400).send({ status: false, message: err.sqlMessage })
            })
        }else{
            res.status(400).send({ status: false, message: "Estatus inválido" })
        }
     



    
    } catch (error) {
        res.status(400).send({ status: false, message: "Error de servidor" })
    }
});

module.exports = {
    UpdateOneQuote: UpdateOneQuote,
};
