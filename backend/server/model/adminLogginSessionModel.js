const mongoose = require("mongoose")

const adminlogginSessionSchema = new mongoose.Schema({
    ID : {type : mongoose.Schema.Types.ObjectId, ref : 'admin'},
},{timestamps : true});

module.exports = mongoose.model("adminLogginSession", adminlogginSessionSchema);