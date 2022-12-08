import Joi from "joi";
import Mongoose from "mongoose";
import _ from "lodash";
import config from "config";
import apiError from "../../helper/apiError";
import response from '../../../assets/response';
const bcrypt = require('bcryptjs');
import responseMessage from '../../../assets/responseMessage';
import commonFunction from '../../helper/util';
import jwt from "jsonwebtoken";
import { userServices } from '../../services/user';
const { findUser, findSuperUser, findAdmin } = userServices;
import status from '../../enum/status';
import auth from "../../helper/auth";
import speakeasy from 'speakeasy';
import userType from "../../enum/userType";
const secret = speakeasy.generateSecret({ length: 10 });
// import { userServices } from '../../services/user';
import axios from 'axios';
const StudentIssueDB = require("../../model/student_certificate_schema")
const studentDB = require("../../model/student.model")

const superAdminLogginSessionDB = require("../../model/superAdminlogginSessionModel")
const adminLogginSessionDB = require("../../model/adminLogginSessionModel")
const studentLogginSessionDB = require("../../model/studentLogginSessionModel")
let fabricEnrollment  = require('../../services/fabric/enrollment');

const studentServices = require("../../services/student-service");
// const { userCheck, paginateSearch, getall, insertManyUser, createAddress, checkUserExists, emailMobileExist, createUser, findUser, updateUser, updateUserById, checkSocialLogin } = userServices;
export class admincontroller {

    //Sign up 
    /**
    * @swagger
    * /user/userRegister:
    *   post:
    *     tags:
    *       - User
    *     description: Create User
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: national_ID
    *         description: User National ID
    *         in: formData
    *         required: true
    *       - name: student_Name
    *         description: User Name
    *         in: formData
    *         required: true
    *       - name: student_Email_ID
    *         description: User Email ID
    *         in: formData
    *         required: true
    *       - name: student_Password
    *         description: User Password
    *         in: formData
    *         required: true
    *       - name: contact
    *         description: Contact No.
    *         in: formData
    *         required: true
    *       - name: dob
    *         description: dateOfBirth
    *         in: formData
    *         required: true
    *     responses:
    *       200:
    *         description: Returns success message
    */

    async userRegister(req, res, next) {
        const { national_ID, student_Name, student_Email_ID, student_Password, contact, dob } = req.body;
        console.log(req.body);
        try {
            const studentUser = await studentDB.findOne({ national_ID: national_ID, student_Email_ID: student_Email_ID })
            console.log(studentUser);
            if (national_ID === "" && student_Name === "" && student_Email_ID === "" && student_Password === "" && contact == "" && dob == "" && national_ID === null && student_Name === null && student_Email_ID === null && student_Password === null && contact == null && dob == null && national_ID === undefined && student_Name === undefined && student_Email_ID === undefined && student_Password === undefined && contact === undefined && dob === undefined) {
                console.log("null data");
                res.status(400).send({ status: "error", message: "Please enter all the details compulsory !" });
                return;
            } else if (studentUser) {
                console.log("Avail data");
                res.status(400).send({ status: "error", message: "Student already exist please enter new details !" });
                return;
            } else {
                let keys = await fabricEnrollment.registerUser(student_Email_ID);

                const studentData = new studentDB({
                    national_ID: national_ID,
                    student_Name: student_Name,
                    student_Email_ID: student_Email_ID,
                    student_Password: student_Password,
                    contact: contact,
                    dob: dob,
                    publicKey: keys.publicKey
                })
                studentData.save((err, data) => {
                    if (err) {
                        res.status(400).send({ message: err });
                        return;
                    }
                    res.status(200).send({ status: "success", message: "Student Created Successfully !", student: data });
                    return
                })
            }
        } catch (error) {
            return res.status(400).send({ status: "Error", message: error });
        }

    }

    //Student SignIn
    /**
        * @swagger
        * /user/userSignin:
        *   post:
        *     tags:
        *       - User
        *     description: Student Login
        *     produces:
        *       - application/json
        *     parameters:
        *       - name: national_ID
        *         description: Student national_ID
        *         in: formData
        *         required: true
        *     responses:
        *       200:
        *         description: Returns success message
        */

    async userSignin(req, res, next) {
        const { national_ID } = req.body;
        try {
            const user = await studentDB.findOne({ national_ID: national_ID })

            // const password = user.student_Password

            if (national_ID === "" || national_ID === null || national_ID === undefined) {

                res.status(400).send({ status: "error", message: "Please enter Admin ID !" });
                return;
            } else if (user) {
                // if (password == student_Password) {
                    const token = jwt.sign({ id: user._id },config.get('jwtsecret'), { expiresIn: "1h" });


                    const loginData = new studentLogginSessionDB({
                        
                        ID: user._id
                    })
                    loginData.save();
                    res.status(200).send({ status: "success", message: "Successfully  Login", user: user , Token:token});
                    return;
                // } else {
                //     res.status(400).send({ status: "error", message: "Password Not Matched." });
                //     return;
                // }
            } else {
                res.status(400).send({ status: "error", message: "Student Not found" });
                return;
            }
        } catch (error) {
            res.status(400).send({ status: "error", message: "User Not found" });
            return;
        }
    }

  /**
    * @swagger
    * /user/viewCertificate:
    *   get:
    *     tags:
    *       - User
    *     description: View Student Certificates
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: token
    *         description: User Token
    *         in: header
    *         required: true
    *     responses:
    *       200:
    *         description: Returns success message
    */

   async viewCertificate(req, res, next) {
    try {
        let userResult = await findUser({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
        console.log(userResult, 125)
        if (!userResult) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        let certificates = await studentServices.getCertificateDataforDashboard(userResult.publicKey, userResult.student_Email_ID)
        console.log(certificates, 197)
        if(certificates)
            return res.status(200).send({ status: "success", message: "Fetched Student Certificates", result: certificates });
    } catch (error) {
        return res.status(400).send({ status: "Error", message: error });
    }

}

}



export default new admincontroller()