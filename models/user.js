const { strong } = require("framer-motion/client");
const mongoose = require("mongoose");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const paasportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: string,
        required: true,
    },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);