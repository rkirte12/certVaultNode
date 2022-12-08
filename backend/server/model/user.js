// import Mongoose, { Schema, Types } from "mongoose";
// import mongoosePaginate from "mongoose-paginate";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
// import userType from "../Enum/userType";
// import status from '../Enum/status';
// import bcrypt from 'bcryptjs';
// import commonFunction from '../helper/util';

// var userModel = new Schema(
//     {
//         firstName: {
//             type: String
//         },
//         lastName: {
//             type: String
//         },
//         middleName: {
//             type: String
//         },
//         email: {
//             type: String
//         },
//         password: {
//             type: String
//         },
//         mobileNumber: {
//             type: String
//         },
//         userType: {
//             type: String,
//             default: userType.USER
//         },
//         countryCode: {
//             type: String
//         },
//         country: {
//             type: String
//         },
//         city: {
//             type: String
//         },
//         state: {
//             type: String
//         },
//         dateOfBirth: {
//             type: String
//         },
//         gender: {
//             type: String,
//             enum: ['MALE', 'FEMALE']
//         },
//         profilePic: {
//             type: String
//         },
//         otp: {
//             type: Number
//         },
//         otpVerified: {
//             type: Boolean,
//             default: false
//         },
//         otpExpireTime: {
//             type: Number
//         },
//         status: {
//             type: String,
//             default: status.ACTIVE
//         },
//         deviceToken: {
//             type: String
//         },
//         deviceType: {
//             type: String
//         },
//     },
//     { timestamps: true }
// );
// userModel.index({ location: "2dsphere" })
// userModel.plugin(mongooseAggregatePaginate)
// userModel.plugin(mongoosePaginate);
// module.exports = Mongoose.model("user", userModel);

// Mongoose.model("user", userModel).findOne({ userType: userType.ADMIN }, (err, result) => {
//     if (err) {
//         console.log("DEFAULT ADMIN ERROR", err);
//     }
//     else if (result) {
//         console.log("Default Admin already exist.");
//     }
//     else {
//         let obj = {
//             userType: userType.ADMIN,
//             firstName: "Mobiloitte",
//             lastName: "Technology",
//             countryCode: "+91",
//             mobileNumber: 9588400366,
//             email: "mobiloitte.node@gmail.com",
//             dateOfBirth: "01/01/2004",
//             otpVerified: true,
//             password: bcrypt.hashSync("Password@123"),
//             city: "Pune, India"
//         };
//         Mongoose.model("user", userModel)(obj).save((err1, result1) => {
//             if (err1) {
//                 console.log("DEFAULT ADMIN  creation ERROR", err1);
//             } else {
//                 console.log("DEFAULT ADMIN Created", result1);
//             }
//         });
//     }
// });