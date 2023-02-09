const { knex } = require("../../../database/connection");
const { AddOnePartitionsValidation } = require("./CreateOnePartition.Validation");


const CreateOneQuote = require("express").Router();



CreateOneQuote.post("/one", async (req, res) => {
    try {

        let isAnExistentBrand = true
        let isAnExistentCategory = true
        let isAnExistentQuote = true
        const validation = await AddOnePartitionsValidation(req.body, req.headers.verbose)
        const valid = validation.status || validation.data.invalidParameters.concat(validation.data.missingParameters).toString()
        if (valid === true) {

            const isAnExistentQuotesQuery = await knex("quotes").where({ id: req.body.quoteID})
            isAnExistentQuote = isAnExistentQuotesQuery.length === 0
            // if the id of the category is not an id of a category record
            if (isAnExistentQuote) {
                res.status(400).send({ status: false, message: "La cotización no existe" })
                return
            }


            // if the quote found has alredy been sent to the client
            if (isAnExistentQuotesQuery[0].emitted === true) {
                res.status(400).send({ status: false, message: "No se puede agregar partidas a una cotización enviada" })
                return
            }


            // if the id of the category is not an id of a category record
            if (req.body.categoryID) {
                const isAnExistentCategoryQuery = knex("categories").where({ id: req.body.categoryID })
                isAnExistentCategory = isAnExistentCategoryQuery.length === 0
                if (isAnExistentCategory) {
                    res.status(400).send({ status: false, message: "La categoría no existe" })
                    return
                }
            }

            // if the id of the brand is not an id of a brand record
            if (req.body.brandID) {
                const isAnExistentBrandQuery = knex("brands").where({ id: req.body.brandID })
                isAnExistentBrand = isAnExistentBrandQuery.length === 0
                if (isAnExistentBrand) {
                    res.status(400).send({ status: false, message: "La marca no existe" })
                    return
                }
            }

            req.body.edd = new Date(new Date(req.body.edd).toLocaleString('en-US', {timeZone: 'America/Denver'})).toISOString().replace(/T/, ' ').replace(/\..+/, '')

            knex("partitions").insert(req.body).then(async (e) => {

                const lastInserted = await knex.select(["partitions.*", "categories.category_name", "brands.brand_name"]).from("partitions").where({ "partitions.created_by": req.body.created_by })
                .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
                .leftJoin('brands', 'partitions.brandID', '=', 'brands.id').orderBy("created_at", "desc").limit(1)

                res.status(200).send({ status: true, message: "Partida añadida", data: lastInserted })

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
    CreateOneQuote: CreateOneQuote,
};
