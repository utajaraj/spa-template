const { knex } = require("../../../database/connection");
const SubmitMyPartitions = require("express").Router();
const ejs = require("ejs")
const path = require("path")
const puppeteer = require('puppeteer')

SubmitMyPartitions.patch("/submit", async (req, res) => {
    delete req.query.modified_by

    if (Number.isInteger(req.body.id)) {

        knex.transaction(async trx => {
            const quotePromise = knex.select(["quotes.*", "clients.client_name", "buyers.buyer_name", "buyers.buyer_last_name", "users.user_name", "users.user_middle_name", "users.user_last_name"]).from("quotes")
                .where({ "quotes.created_by": req.body.created_by, "quotes.id": req.body.id })
                .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
                .leftJoin('buyers', 'quotes.buyerID', '=', 'buyers.id')
                .leftJoin('users', 'quotes.agentID', '=', 'users.id')
            const partitionsPromise = knex.select(["partitions.*", "categories.category_name", "brands.brand_name"]).from("partitions")
                .where({ "partitions.created_by": req.body.created_by, "partitions.quoteID": req.body.id })
                .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
                .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
            const [quoteDate, partitionsDate] = await Promise.all([quotePromise, partitionsPromise])
            const [quote, partitions] = [quoteDate[0], partitionsDate]

            const changeEmitted = await knex("quotes").update({ emitted: true }).where({ created_by: req.body.created_by, id: req.body.id })

            return {
                changeEmitted, quote, partitions
            }


        }).then(function ({ changeEmitted, quote, partitions }) {

            ejs.renderFile(path.join(__dirname + "/../../../views/QuoteTemplate.ejs"), { quote, partitions }, async function (err, str) {
                if (err) {
                    res.status(400).send({ status: false, message: "Cotización generada pero no se pude descargar PDF", error: err.toString() })
                    return
                };

                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                await page.setContent(str, {
                    waitUntil: 'domcontentloaded'
                });
                const pdf = await page.pdf({ format: 'A4' });
                res.status(200).send({ status: true, message: "Cotización iniciada", data: pdf })


            })
        }).catch(function (transaction) {
            console.log(transaction);
        })

    } else {

        res.status(400).send({ status: false, message: "Cotización inválida" })

    }
});

module.exports = {
    SubmitMyPartitions: SubmitMyPartitions,
};
