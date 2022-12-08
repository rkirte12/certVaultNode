const mongoose = require("mongoose")

const studentLogginSessionSchema = new mongoose.Schema({
    ID : {type : mongoose.Schema.Types.ObjectId, ref : 'student'},
},{timestamps : true});

module.exports = mongoose.model("studentLogginSession", studentLogginSessionSchema);