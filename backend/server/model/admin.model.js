const mongoose = require("mongoose")
const bcryptjs = require("bcrypt");
const { string } = require("joi");

const adminSchema = new mongoose.Schema({
    adminID:{ type: String, required : false },
    name: { type : String, required : false},
    email: { type : String, required : true},
    password:{ type: String, required: true },
    publicKey:{type: String, require: false},
    universityName:{type: String, require: false},
    universityEmail:{type: String, require: false},
});
module.exports = mongoose.model("admins", adminSchema);