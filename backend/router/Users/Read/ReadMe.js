const { knex } = require("../../../database/connection");

const ReadMe = require("express").Router();


ReadMe.get("/me", async (req, res) => {
    try {
        const response = await knex("users").where({ id: req.body.created_by })
        res.send(response);
    } catch (error) {
        res.status(400).send([])
    }
});

module.exports = {
    ReadMe: ReadMe,
};
