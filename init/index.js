const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function initDB() {
    await mongoose.connect(MONGO_URL);

    console.log("connected to DB");

    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6a8316a7b7fe4a6e9de1dd56" }));
    await Listing.insertMany(initData.data);

    console.log("data was initialized");

    await mongoose.connection.close();
    console.log("database connection closed");
}

if (require.main === module) {
    initDB().catch((err) => {
        console.error("Database initialization failed:", err);
        process.exit(1);
    });
}

module.exports = { initDB };