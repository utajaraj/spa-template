const { knex } = require("../../../database/connection");
const SubmitMyPartitions = require("express").Router();
const ejs = require("ejs")
const path = require("path")
const puppeteer = require('puppeteer');
const { toSpanish } = require("../../../factors/math/NumberToSpanish");
const fs = require('fs');
SubmitMyPartitions.patch("/submit", async (req, res) => {

    delete req.query.modified_by

    if (Number.isInteger(req.body.id)) {

        knex.transaction(async trx => {
            const quoteInformation = await trx.select(["partitions.*", "categories.category_name", "brands.brand_name",
                "quotes.currency",
                "quotes.buyerID",
                "quotes.agentID",
                "quotes.reference",
                "quotes.companyID",
                "quotes.created_at",
                "quotes.date_emitted",
                "quotes.clientID",
                "quotes.emitted",
                "quotes.companyID",
                "quotes.expiration_date",
                "users.user_name",
                "users.user_middle_name",
                "users.user_last_name",
                "buyers.buyer_name",
                "buyers.buyer_last_name",
                "clients.client_name",
                "clients.client_serialization",
                "clients.street",
                "clients.postalCode",
                "clients.city",
                "clients.state",
                "clients.country",
                "companies.company_address",
                "companies.logo_name",
                "companies.company_color",
                "companies.company_commercial_name",
                "companies.company_name",
            ]).from("partitions")
                .where({ "partitions.quoteID": req.body.id })
                .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
                .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
                .leftJoin('quotes', 'partitions.quoteID', '=', 'quotes.id')
                .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
                .leftJoin('buyers', 'quotes.buyerID', '=', 'buyers.id')
                .leftJoin('users', 'quotes.agentID', '=', 'users.id')
                .leftJoin('companies', 'quotes.companyID', '=', 'companies.id')



            let { reference, currency, buyer_name, buyer_last_name, client_name, expiration_date, user_name, user_middle_name, user_last_name, company_address, logo_name, company_commercial_name, company_color, company_name, created_at, date_emitted, iva_tax, street, postalCode, city, state } = quoteInformation[0]
            const quote = { reference, currency, buyer_name, buyer_last_name, client_name, expiration_date, user_name, user_middle_name, user_last_name, company_address, logo_name, company_commercial_name, company_color, company_name, created_at, date_emitted, iva_tax, street, postalCode, city, state }



            if (!date_emitted) {

                date_emitted = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                const changeEmitted = await trx("quotes").update({ emitted: true, date_emitted }).where({ id: req.body.id })
            }



            const partitions = quoteInformation

            return { quote, partitions }

        }).then(function ({ quote, partitions }) {

            const logo = fs.readFileSync(__dirname + `/../../../assets/${quote.logo_name}.svg`)

            const quoteBackground = fs.readFileSync(__dirname + `/../../../assets/quote-background.svg`)
            const brandsImage = fs.readFileSync(__dirname + `/../../../assets/brands.png`, { encoding: 'base64' })


            ejs.renderFile(path.join(__dirname + "/../../../views/QuoteTemplate.ejs"), { quote, partitions, includeBrand: false, logo, quoteBackground, brandsImage }, async function (err, str) {


                if (err) {
                    console.log(err)
                    res.status(400).send({ status: false, message: "Cotización generada pero no se pudó descargar PDF", error: err.toString() })
                    return
                }

                try {
                    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                    const page = await browser.newPage();
                    await page.setContent(str, {
                        waitUntil: 'domcontentloaded',
                        encoding: "base64",
                    })
                    const pdf = await page.pdf({ format: 'A4', landscape: true })
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


SubmitMyPartitions.patch("/submit/brands", async (req, res) => {

    delete req.query.modified_by

    if (Number.isInteger(req.body.id)) {

        knex.transaction(async trx => {
            const quoteInformation = await trx.select(["partitions.*", "categories.category_name", "brands.brand_name",
                "quotes.currency",
                "quotes.buyerID",
                "quotes.agentID",
                "quotes.reference",
                "quotes.companyID",
                "quotes.clientID",
                "quotes.emitted",
                "quotes.companyID",
                "quotes.created_at",
                "quotes.date_emitted",
                "quotes.expiration_date",
                "users.user_name",
                "users.user_middle_name",
                "users.user_last_name",
                "buyers.buyer_name",
                "buyers.buyer_last_name",
                "clients.client_name",
                "clients.client_serialization",
                "clients.street",
                "clients.postalCode",
                "clients.city",
                "clients.state",
                "clients.country",
                "companies.company_address",
                "companies.logo_name",
                "companies.company_color",
                "companies.company_commercial_name",
                "companies.company_name",
            ]).from("partitions")
                .where({ "partitions.quoteID": req.body.id })
                .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
                .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
                .leftJoin('quotes', 'partitions.quoteID', '=', 'quotes.id')
                .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
                .leftJoin('buyers', 'quotes.buyerID', '=', 'buyers.id')
                .leftJoin('users', 'quotes.agentID', '=', 'users.id')
                .leftJoin('companies', 'quotes.companyID', '=', 'companies.id')


            let { company_address, reference, currency, buyer_name, buyer_last_name, client_name, expiration_date, user_name, user_middle_name, user_last_name, logo_name, company_commercial_name, company_color, company_name, created_at, date_emitted, iva_tax, street, postalCode, city, state } = quoteInformation[0]
            const quote = { reference, currency, buyer_name, buyer_last_name, client_name, expiration_date, user_name, user_middle_name, user_last_name, company_address, logo_name, company_commercial_name, company_color, company_name, created_at, date_emitted, iva_tax, street, postalCode, city, state }



            if (!date_emitted) {

                date_emitted = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' })).toISOString().replace(/T/, ' ').replace(/\..+/, '')
                const changeEmitted = await trx("quotes").update({ emitted: true, date_emitted }).where({ id: req.body.id })
            }
            const partitions = quoteInformation


            return { quote, partitions }

        }).then(function ({ quote, partitions }) {


            const logo = fs.readFileSync(__dirname + `/../../../assets/${quote.logo_name}.svg`)
            const quoteBackground = fs.readFileSync(__dirname + `/../../../assets/quote-background.svg`)

            const brandsImage = fs.readFileSync(__dirname + `/../../../assets/brands.png`, { encoding: 'base64' })

            ejs.renderFile(path.join(__dirname + "/../../../views/QuoteTemplate.ejs"), { quote, partitions, includeBrand: true, logo, quoteBackground, brandsImage }, async function (err, str) {

                if (err) {
                    res.status(400).send({ status: false, message: "Cotización generada pero no se pudo descargar PDF", error: err.toString() })
                    return
                }

                try {
                    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                    const page = await browser.newPage();
                    await page.setContent(str, {
                        waitUntil: 'domcontentloaded',
                        encoding: "base64",
                    })
                    const pdf = await page.pdf({ format: 'A4', landscape: true })
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
