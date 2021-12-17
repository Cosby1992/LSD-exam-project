const {mongodb} = require('../../config');
const {MongoClient} = require('mongodb');

const cleanDB = async () => {
    const url = "mongodb://" + mongodb.host + ":" + mongodb.port;
    const client = new MongoClient(url);

    client.connect();

    await client.db(mongodb.userdbname).dropDatabase();
    await client.db(mongodb.fakecphdbname).dropDatabase();

    console.log("Successfully cleaned db");
    process.exit(0)

}

cleanDB();