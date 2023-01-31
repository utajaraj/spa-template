const { knex } = require("../../../database/connection");
const SubmitMyPartitions = require("express").Router();
const ejs = require("ejs")
const path = require("path")
const puppeteer = require('puppeteer');
const { toSpanish } = require("../../../factors/math/NumberToSpanish");
const { readFileSync } = require('fs');
const img = `data:image/png;base64,${new Buffer(readFileSync(path.join(__dirname + "/../../../public/garle-logo.png"))).toString()}`
SubmitMyPartitions.patch("/submit", async (req, res) => {
    delete req.query.modified_by

    if (Number.isInteger(req.body.id)) {

        knex.transaction(async trx => {
            const quoteInformation = await knex.select(["partitions.*", "categories.category_name", "brands.brand_name",
                "quotes.reference",
                "quotes.currency",
                "quotes.buyerID",
                "quotes.agentID",
                "quotes.clientID",
                "quotes.emitted",
                "quotes.expiration_date",
                "users.user_name",
                "users.user_middle_name",
                "users.user_last_name",
                "buyers.buyer_name",
                "buyers.buyer_last_name",
                "clients.client_name",
            ]).from("partitions")
                .where({ "partitions.created_by": req.body.created_by, "partitions.quoteID": req.body.id })
                .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
                .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
                .leftJoin('quotes', 'partitions.quoteID', '=', 'quotes.id')
                .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
                .leftJoin('buyers', 'quotes.buyerID', '=', 'buyers.id')
                .leftJoin('users', 'quotes.agentID', '=', 'users.id')

            const changeEmitted = await knex("quotes").update({ emitted: true }).where({ created_by: req.body.created_by, id: req.body.id })

            return quoteInformation

        }).then(function (quoteInformation) {

            const total = quoteInformation.map((partition) => { return partition.cost * (1 + partition.factor / 100) * partition.quantity }).reduce((partialSum, a) => partialSum + a, 0);
            const totalInWords = toSpanish(total)
            const { reference, currency, buyer_name, buyer_last_name, client_name, expiration_date, user_name, user_middle_name, user_last_name } = quoteInformation[0]
            const quote = { reference, currency, buyer_name, buyer_last_name, client_name, expiration_date, user_name, user_middle_name, user_last_name, total, totalInWords }
            const partitions = quoteInformation


            ejs.renderFile(path.join(__dirname + "/../../../views/QuoteTemplate.ejs"), { quote, partitions, img }, async function (err, str) {
                console.log(str);
                if (err) {
                    res.status(400).send({ status: false, message: "Cotización generada pero no se pude descargar PDF", error: err.toString() })
                    return
                }

                try {
                    const browser = await puppeteer.launch({ headless: true});
                    const page = await browser.newPage();
                    await page.setContent(str, {
                        waitUntil: 'domcontentloaded',
                        encoding: "base64" 
                    })
                    const pdf = await page.pdf({ format: 'A4' })
                    res.status(200).send({ status: true, message: "Cotización iniciada", data: pdf })
                    browser.close()

                } catch (error) {

                    res.status(400).send({ status: false, message: "Cotización generada, pero hubo fallo al generar PDF" })
                }
            })
        }).catch(function (transaction) {

            res.status(400).send({ status: false, message: "Cotización no generada" })
        })

    } else {

        res.status(400).send({ status: false, message: "Cotización inválida" })

    }
});

module.exports = {
    SubmitMyPartitions: SubmitMyPartitions,
};
