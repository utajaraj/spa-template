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

                    res.status(400).send({ status: false, message: "No se puede generar una cotización sin partidas" })

                } else {


                    req.body.expiration_date = new Date(new Date(req.body.expiration_date).toLocaleString('en-US', {timeZone: 'America/Denver'})).toISOString().replace(/T/, ' ').replace(/\..+/, '')


                    knex.transaction(async trx => {


                        const clientCount = await knex("counts").where({ counts_clientID: req.body.clientID })

                        if (clientCount.length == 0) {
                            req.body.reference = `${isAnExistentClientResult[0].client_serialization}-${0}`
                            const insertCount = await knex("counts").insert({ counts_clientID: req.body.clientID, counts: 1 })
                        } else {

                            req.body.reference = `${isAnExistentClientResult[0].client_serialization}-${clientCount[0].counts + 1}`
                            const updateCount = await knex("counts").update({ counts: clientCount[0].counts + 1 }).where({ counts_clientID: req.body.clientID })

                        }

                        const insertQuote = await knex("quotes").insert(req.body)
                        const lastInserted = await knex("quotes").select().where({ created_by: req.body.created_by }).orderBy("created_at", "desc").limit(1)

                        return lastInserted

                    }).then(function (quoteInformation) {

                        res.status(200).send({ status: true, message: "Cotización agregada", data: quoteInformation })

                    }).catch((err) => {
                        console.log(err);
                        res.status(400).send({ status: false, message: "Error al crear cotización", error: err.toString() })
                    })


                }
            } else {
                const invalidIDMessage = `${isAnExistentAgent ? "" : "Agente no existe."} ${isAnExistentClient ? "" : "Cliente no existe."} ${isAnExistentBuyer ? "" : "Comprador no existe."}`
                res.status(400).send({ status: false, message: invalidIDMessage })
            }
        } else {
            res.status(400).send({ status: false, message: valid })
        }
    } catch (error) {
        res.status(400).send({ status: false, message: "Error de servidor" })
    }
});

module.exports = {
    CreateOneQuote: CreateOneQuote,
};
