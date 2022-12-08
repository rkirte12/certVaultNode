const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs");
const string = require("joi/lib/types/string");


const studentCertificateSchema = new mongoose.Schema({
    roll_Num: { type: String, required: true },
    first_Name: { type: String, required: true },
    last_Name: { type: String, required: true },
    certificate_Num: { type: String, required: true },
    year_of_Passing: { type: String, required: true },
    national_ID: { type: String, required: true },
    document_Type: { type: String, required: true },
    programs: { type: String, required: true },
    department: { type: String, required: true },
    streams: { type: String, required: true },
    doc_URL: { type: String, required: false },
    universityEmail :{ type: String, required: false },
    universityName :{ type: String, required: true },
    file_Upload: { type: String, required: false },  
    hash: { type: String, required: false }  

});

module.exports = mongoose.model("Student Certificate", studentCertificateSchema);