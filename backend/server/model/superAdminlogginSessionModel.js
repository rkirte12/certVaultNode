
const mongoose = require("mongoose")

const superAdminlogginSessionSchema = new mongoose.Schema({
    ID : {type : mongoose.Schema.Types.ObjectId, ref : 'superAdmin'},
},{timestamps : true});

module.exports = mongoose.model("superAdminLogginSession", superAdminlogginSessionSchema);