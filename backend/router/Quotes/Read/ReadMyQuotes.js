const { knex } = require("../../../database/connection");
const ReadMyQuotes = require("express").Router();



ReadMyQuotes.get("/mine", async (req, res) => {
  try {
    const quotes = await knex.select(["quotes.*", "clients.client_name"])
      .from("quotes")
      .where({ "quotes.created_by": req.query.created_by, "quotes.emitted": false })
      .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
    res.status(200).send(quotes)
  } catch (error) {
    res.status(200).send([])
  }
});


ReadMyQuotes.get("/total", async (req, res) => {
  try {
    const partitions = await knex.select(["partitions.*", "categories.category_name", "brands.brand_name",
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
      .leftJoin('categories', 'partitions.categoryID', '=', 'categories.id')
      .leftJoin('brands', 'partitions.brandID', '=', 'brands.id')
      .leftJoin('quotes', 'partitions.quoteID', '=', 'quotes.id')
      .leftJoin('clients', 'quotes.clientID', '=', 'clients.id')
      .leftJoin('buyers', 'quotes.buyerID', '=', 'buyers.id')
      .leftJoin('users', 'quotes.agentID', '=', 'users.id')


    const partitionsByQuoteID = {}
    for (let i = 0; i < partitions.length; i++) {
      const partition = partitions[i]

      const partitionInformation = partitionsByQuoteID[partition.quoteID]

      if (partitionInformation === undefined) {

        // set quote object to store information
        partitionsByQuoteID[partition.quoteID] = {
          quoteID: partition.quoteID,
          reference: partition.reference,
          total: partition.amount,
          numberOfPartitions: 1,
          agent: `${partition.user_name} ${partition.user_middle_name} ${partition.user_last_name}`,
          categories: partition.category_name ? [partition.category_name] : [],
          brands: partition.brand_name ? [partition.brand_name] : [],
          currency: partition.currency,
          client: partition.client_name,
          part_number: partition.part_number ? [partition.part_number] : [],
          buyer: `${partition.buyer_name}${partition.buyer_last_name ? " " + partition.buyer_last_name : ""}`,
          cost: partition.cost,
          factor: partition.cost,
          edd: [new Date(partition.edd).toLocaleDateString('en', {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          })],
          expiration_date: new Date(partition.expiration_date).toLocaleDateString('en', {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          }),
          created_at: new Date(partition.created_at).toLocaleDateString('en', {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          }),
          emitted: partition.emitted == 1 ? "Sí" : "No",
          partitions: [partition],
          profit: partition.amount - partition.cost
        }


      } else {
        for (let i = 0; i < Object.keys(partitionsByQuoteID[partition.quoteID]).length; i++) {
          const key = Object.keys(partitionsByQuoteID[partition.quoteID])[i];


          if (key == "numberOfPartitions") {
            partitionsByQuoteID[partition.quoteID][key] = partitionsByQuoteID[partition.quoteID][key] + 1
          }
          if (key == "partitions") {
            partitionsByQuoteID[partition.quoteID][key].push(partition)
          }
          if (key == "categories" && !partitionsByQuoteID[partition.quoteID][key].includes(partition.category_name)) {
            partitionsByQuoteID[partition.quoteID][key].push(partition.category_name)
          }
          if (key == "brands" && !partitionsByQuoteID[partition.quoteID][key].includes(partition.brand_name)) {
            partitionsByQuoteID[partition.quoteID][key].push(partition.brand_name)
          }
          if (key == "part_number") {
            partitionsByQuoteID[partition.quoteID][key].push(partition.part_number)
          }
          if (key == "total") {
            partitionsByQuoteID[partition.quoteID][key] = partitionsByQuoteID[partition.quoteID][key] + partition.amount
          }
          if (key == "cost") {
            partitionsByQuoteID[partition.quoteID][key] = partitionsByQuoteID[partition.quoteID][key] + partition.cost
          }

        }
        partitionsByQuoteID[partition.quoteID]["profit"] = partitionsByQuoteID[partition.quoteID]["profit"] + (partition.amount - partition.cost)

      }


    }

    const result = []

    for (let i = 0; i < Object.keys(partitionsByQuoteID).length; i++) {
      const key = Object.keys(partitionsByQuoteID)[i];
      result.push(partitionsByQuoteID[key])
    }

    res.status(200).send(result)
  } catch (error) {
    res.status(200).send([])
  }
});


module.exports = {
  ReadMyQuotes: ReadMyQuotes,
};
