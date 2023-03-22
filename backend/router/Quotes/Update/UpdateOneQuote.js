const { knex } = require("../../../database/connection");
const { UpdateOneQuotesValidation } = require("./UpdateOneQuote.Validation");


const UpdateOneQuote = require("express").Router();



UpdateOneQuote.patch("/one", async (req, res) => {
    try {
        let isAnExistentClient = true
        let isAnExistentBuyer = true
        let isAnExistentAgent = true
        let isAnExistentQuote = true
        const validation = await UpdateOneQuotesValidation(req.body, req.headers.verbose)
        const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
        if (valid === true) {

            const isAnExistentQuotesQuery = await knex("quotes").select("id").where({ id: req.body.id })
            isAnExistentQuote = isAnExistentQuotesQuery.length === 0
            // if the id of the category is not an id of a category record
            if (isAnExistentQuote) {
                res.status(400).send({ status: false, message: "La cotización no existe" })
                return
            }


            // if the quote found has alredy been sent to the client
            if (isAnExistentQuotesQuery[0].emitted === true) {
                res.status(400).send({ status: false, message: "No se puede modificar a una cotización enviada" })
                return
            }


            // if the id of the category is not an id of a category record
            if (req.body.clientID) {
                const isAnExistentClientQuery = knex("clients").select("id").where({ id: req.body.clientID })
                isAnExistentClient = isAnExistentClientQuery.length === 0
                if (isAnExistentClient) {
                    res.status(400).send({ status: false, message: "El cliente no existe" })
                    return
                }
            }

            // if the id of the brand is not an id of a brand record
            if (req.body.buyerID) {
                const isAnExistentBuyerQuery = knex("buyers").select("id").where({ id: req.body.buyerID })
                isAnExistentBuyer = isAnExistentBuyerQuery.length === 0
                if (isAnExistentBuyer) {
                    res.status(400).send({ status: false, message: "El comprador no existe" })
                    return
                }
            }

            // if the id of the agent is not an id of a user record
            if (req.body.agentID) {
                const isAnExistentAgentQuery = knex("users").select("id").where({ id: req.body.agentID })
                isAnExistentAgent = isAnExistentAgentQuery.length === 0
                if (isAnExistentAgent) {
                    res.status(400).send({ status: false, message: "El agente no existe" })
                    return
                }
            }

            const { id } = req.body
            delete req.body.id
            req.body.expiration_date = new Date(new Date(req.body.expiration_date).toLocaleString('en-US', {timeZone: 'America/Denver'})).toISOString().replace(/T/, ' ').replace(/\..+/, '')
            knex("quotes").update(req.body).where({ created_by: req.body.created_by, id }).then(async (e) => {

                const updatedQuote = await knex("quotes").select().where({ created_by: req.body.created_by, id }).limit(1)

                res.status(200).send({ status: true, message: "Cotización actualizada", data: updatedQuote })

            }).catch((err) => {

                res.status(400).send({ status: false, message: err.sqlMessage })

            })

        } else {
            res.status(400).send({ status: false, message: valid })
        }

    } catch (error) {
        res.status(400).send({ status: false, message: "Error de servidor" })
    }
});

module.exports = {
    UpdateOneQuote: UpdateOneQuote,
};
