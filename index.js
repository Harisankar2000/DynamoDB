const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
let url = "mongodb://localhost:27017/Samplecsv";
csvtojson()
  .fromFile("./User_Sample.csv")
  .then(csvData => {
    console.log(csvData);
    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;
        client
          .db("sample_db")
          .collection("category")
          .insertMany(csvData, (err, res) => {
            if (err) throw err;
            console.log(`Inserted: ${res.insertedCount} rows`);
            client.close();
          });
      }
    );
  });