const mongoose = require("mongoose")



const studentSchema = new mongoose.Schema({
    student_Name: { type: String },
    student_Email_ID: { type: String, required: true },
    contact: { type: String, required: true },
    national_ID: { type: String, required: true },
    student_Password: { type: String, required: true },
    dob: { type: String, required: true },
    publicKey: { type: String, required: false}

});

module.exports = mongoose.model("student", studentSchema);