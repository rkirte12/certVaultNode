const mongoose = require("mongoose");
const bcryptjs = require("bcrypt")
let fabricEnrollment  = require('../services/fabric/enrollment');

const superAdminSchema = new mongoose.Schema({
    email:{ type: String },
    password:{ type: String, required: true },
    role:{ type: String, required: true },
    name:{ type: String, required: true},
    publicKey:{ type: String },
}, { timestamps: true });
  // mongoose.model("superAdmin", superAdminSchema).find({ role: "superAdmin" }, async (err, result) => {
  //   if (err) {
  //     console.log("DEFAULT superAdmin ERROR", err);
  //   }
  //   else if (result.length != 0) {
  //     console.log("Default superAdmin Running 😀 .");
  //   }
  //   else {
  //     let keys = await fabricEnrollment.registerUser("superUser4@gmail.com");

  //     let obj = {
  //       role: "superAdmin",
  //       email: "superUser4@gmail.com",
  //       password: "SuperAdmin@123",
  //       publicKey: keys.publicKey 
  //     };
  //     mongoose.model("superAdmin", superAdminSchema).create(obj, async (err1, result1) => {
  //       if (err1) {
  //         console.log("DEFAULT SuperAdmin creation ERROR", err1);
  //       } else {
  //         console.log("DEFAULT SuperAdmin Created 😀 ", result1);
  //       }
  //     });
  //   }
  // });

module.exports = mongoose.model("superAdmin", superAdminSchema);