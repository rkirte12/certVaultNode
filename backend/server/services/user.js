
const adminDB = require("../model/admin.model")
const superUserDB = require("../model/superAdmin.model")
const studentDB = require("../model/student.model")
// import status from '../../enums/status';
// import userType from "../../enums/userType";


const userServices = {
  findUser: async (query) => {
    return await studentDB.findOne(query);
  },
  findSuperUser: async (query) => {
    return await superUserDB.findOne(query);
  },
  findAdmin: async (query) => {
    return await adminDB.findOne(query);
  },
}

module.exports = { userServices };