const { knex } = require("../../../database/connection");
const { AddOneQuotesValidation } = require("./CreateOneQuote.Validation");


const CreateOneQuote = require("express").Router();



CreateOneQuote.post("/one", async (req, res) => {
    try {
        const validation = await AddOneQuotesValidation(req.body, req.headers.verbose)
        const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
        if (valid === true) {
            const isAnExistentClientQuery = knex("clients").where({ id: req.body.clientID })
            const isAnExistentAgentQuery = knex("users").where({ id: req.body.agentID })
            const isAnExistentBuyerQuery = knex("buyers").where({ id: req.body.buyerID })
            const [isAnExistentClientResult, isAnExistentAgentResult, isAnExistentBuyerResult] = await Promise.all([isAnExistentClientQuery, isAnExistentAgentQuery, isAnExistentBuyerQuery])
            const isAnExistentClient = (isAnExistentClientResult.length !== 0)
            const isAnExistentAgent = (isAnExistentAgentResult.length !== 0)
            const isAnExistentBuyer = (isAnExistentBuyerResult.length !== 0)
            if (isAnExistentClient && isAnExistentAgent && isAnExistentBuyer) {

                if (req.body.emitted === true) {

                    // const validation = await AddOneQuotesValidation(req.body, req.headers.verbose)
                    // const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
                } else {

                    knex("quotes").insert(req.body).then(async (e) => {

                        const lastInserted = await knex("quotes").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)

                        res.status(200).send({ status: true, message: "Cotización Iniciada", data: lastInserted })

                    }).catch((err) => {
                        res.status(400).send({ status: false, message: err.sqlMessage })
                    })

                }
            } else {
                const invalidIDMessage = `${isAnExistentAgent ? "" : "Agente no existe."} ${isAnExistentClient ? "" : "Cliente no existe."} ${isAnExistentBuyer ? "" : "Comprador no existe."}`
                res.status(400).send({ status: false, message: invalidIDMessage })
            }
        } else {
            res.status(400).send({status:false,message:valid})
        }
    } catch (error) {
        res.status(400).send({ status: false, message: "Error de servidor" })
    }
});

module.exports = {
    CreateOneQuote: CreateOneQuote,
};
