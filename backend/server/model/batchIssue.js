const mongoose = require("mongoose")
const bcryptjs = require("bcrypt");
const { string } = require("joi");


const batchIssueSchema = new mongoose.Schema({
    batch: { type: String, required: true },
    issuer: { type: String, required: false },
    documentType: { type: String, required: true },
    issuedCerticates: {type:Object, require: false },
});

module.exports = mongoose.model("batchIssue", batchIssueSchema);