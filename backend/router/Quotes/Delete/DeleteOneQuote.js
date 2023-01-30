const { knex } = require("../../../database/connection");


const DeleteOneQuote = require("express").Router();


const deletePartitions = async (quotePartitionIds, deleteMatch) => {

    try {
        if (quotePartitionIds.length > 0) {

            const deletePartitions = await knex("partitions").delete().where(deleteMatch).whereIn("id", quotePartitionIds)

            return deletePartitions

        } else {
            return "No hubo partidas para eliminar"
        }
    } catch (error) {
        throw error.toString()
    }
}


DeleteOneQuote.delete("/mine", async (req, res) => {
    const idIsInteger = Number.isInteger(req.body.id)

    try {
        if (idIsInteger) {

            delete req.body.modified_by

            const deletePartitionMatch = { created_by: req.body.created_by, quoteID: req.body.id }
            const deleteQuoteMatch = { created_by: req.body.created_by, id: req.body.id }
            const partitions = await knex("partitions").where(deletePartitionMatch)
            const quotePartitionIds = partitions ? partitions.map((partition) => { return partition.id }) : []

            deletePartitions(quotePartitionIds, deletePartitionMatch).then(async () => {

                try {

                    const deleteQuote = await knex("quotes").delete().where(deleteQuoteMatch)

                    res.status(200).send({ status: true, message: "Cotización eliminada", data: deleteQuote })

                } catch (error) {

                    console.log(error);

                    res.status(400).send({ status: false, message: "Error al eliminar cotización" })
                }

            }).catch((error) => {

                res.status(400).send({ status: false, message: "Error al eliminar partidas de cotización", error: error.toString() })

            })

        } else {

            res.status(400).send({ status: false, message: "Cotización invalidas" })
        }

    } catch (error) {



        res.status(400).send({ status: false, message: "No se eliminó la partida", error: error.toString() })

    }
});

module.exports = {
    DeleteOneQuote: DeleteOneQuote,
};
