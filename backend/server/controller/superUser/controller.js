import Joi from "joi";
import Mongoose from "mongoose";
import _ from "lodash";
import config from "config";
import apiError from "../../helper/apiError";
const fs = require('fs');
const path = require('path');
const csv = require('@fast-csv/parse');
import response from '../../../assets/response';
const bcrypt = require('bcryptjs');
import responseMessage from '../../../assets/responseMessage';
import commonFunction from '../../helper/util';
import jwt from "jsonwebtoken";
import status from '../../enum/status';
import auth from "../../helper/auth";
import speakeasy from 'speakeasy';
import userType from "../../enum/userType";
const secret = speakeasy.generateSecret({ length: 10 });
const { extractArchive } = require("../../services/zipOperaions")//
import { userServices } from '../../services/user';
const { findUser, findSuperUser, findAdmin } = userServices;
import axios from 'axios';
const StudentIssueDB = require("../../model/student_certificate_schema")
const superAdminDB = require("../../model/superAdmin.model")
const adminDB = require("../../model/admin.model")
const studentDB = require("../../model/student.model")
let fabricEnrollment = require('../../services/fabric/enrollment');
const chaincode = require('../../services/fabric/chaincode');
const superAdminLogginSessionDB = require("../../model/superAdminlogginSessionModel")
const adminLogginSessionDB = require("../../model/adminLogginSessionModel")
const studentLogginSessionDB = require("../../model/studentLogginSessionModel")
const universityService = require("../../services/university-service");
// const { userCheck, paginateSearch, getall, insertManyUser, createAddress, checkUserExists, emailMobileExist, createUser, findUser, updateUser, updateUserById, checkSocialLogin } = userServices;
export class admincontroller {

    /**
        * @swagger
        * /superUser/superUserSignin:
        *   post:
        *     tags:
        *       - Super User
        *     description: Super User Signin
        *     produces:
        *       - application/json
        *     parameters:
        *       - name: email
        *         description: Super User Email
        *         in: formData
        *         required: true
        *       - name: password
        *         description: Super User Password
        *         in: formData
        *         required: true
        *         schema:
        *           $ref: '#/definitions/superUserSignin'
        *     responses:
        *       200:
        *         description: Returns success message
        */

    async superUserSignin(req, res, next) {
        const { email, password } = req.body;
        console.log(req.body);
        try {
            const user = await superAdminDB.findOne({ email: email })
            const password = user.password
            console.log(password, 62);

            if (email === "" && email === null && email === undefined) {
                res.status(500).send({ status: "error", message: "Please enter UGC email !" });
                return;
            } else if (user) {
                if (password === password) {
                    const token = jwt.sign({ id: user._id }, config.get("jwtsecret"), { expiresIn: "1h" });


                    const loginData = new superAdminLogginSessionDB({
                        email: user.email,

                    })
                    loginData.save();


                    res.status(200).send({ status: "success", message: "Super Admin Login successfully !", userId: user, Token: token });
                } else {
                    res.status(400).send({ status: "error", message: "Password Not Matched." });
                }
            } else {
                res.status(400).send({ status: "error", message: "Super Admin Not Found !" });
            }
        } catch (error) {
            res.status(400).send({ status: "error", message: "Super Admin not found !" });
        }
    }


    /**
    * @swagger
    * /superUser/createAdmin:
    *   post:
    *     tags:
    *       - Super User 
    *     description: Create Admin Activity
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: token
    *         description: Admin Token
    *         in: header
    *         required: true
    *       - name: email
    *         description: Admin email ID
    *         in: formData
    *         required: true
    *       - name: password
    *         description: Admin password
    *         in: formData
    *         required: true
    *     responses:
    *       200:
    *         description: Returns success message
    */

    async createAdmin(req, res, next) {
        const { email, password } = req.body;
        console.log(req.body);
        try {
            let userResult = await findSuperUser({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
            console.log(userResult, 125)
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            console.log('adminregister')
            const adminUser = await adminDB.findOne({ email: email, password: password })
            console.log(adminUser, 63);
            if (email === "" && password === "" && email === null && password === null && email === undefined && password === undefined) {
                console.log("null data");
                res.status(400).send({ status: "error", message: "Please enter all the details compulsory !" });
                return;
            } else if (adminUser) {
                console.log("Avail data");
                res.status(400).send({ status: "error", message: "Admin already exist please enter new details !" });
                return;
            } else {
                console.log('wallet creation')
                let keys = await fabricEnrollment.registerUser(email);
                console.log(keys, 74)
                const adminData = new adminDB({
                    // national_ID: national_ID,
                    email: email,
                    universityName: userResult.name,
                    universityEmail: userResult.email,
                    password: password,
                    publicKey: keys.publicKey
                })
                console.log(adminData, 78)
                try {
                    adminData.save((err, adminData) => {
                        if (err) {
                            res.status(400).send({ message: err });
                            return;
                        }
                        res.status(200).send({ status: "success", message: "Admin Created Successfully !", admin: adminData });
                        return
                    })
                }
                catch (err) {
                    console.log("error saving to database", err)
                }
            }
        } catch (error) {
            return res.status(400).send({ status: "Error", message: error });
        }

    }

    /**
        * @swagger
        * /superUser/superUserRegister:
        *   post:
        *     tags:
        *       - Super User
        *     description: superUser Register
        *     produces:
        *       - application/json
        *     parameters:
        *       - name: email
        *         description: Super User Email
        *         in: formData
        *         required: true
        *       - name: name
        *         description: University Name
        *         in: formData
        *         required: true
        *       - name: password
        *         description: Super User Password
        *         in: formData
        *         required: true
        *     responses:
        *       200:
        *         description: Returns success message
        */


    async superUserRegister(req, res, next) {
        const { email, password, name } = req.body;
        console.log(req.body, 184);
        try {
            console.log('super user register')
            const adminUser = await superAdminDB.findOne({ email: email, password: password })
            console.log(adminUser, 63);
            if (email === "" && password === "" && email === null && password === null && email === undefined && password === undefined) {
                console.log("null data");
                res.status(400).send({ status: "error", message: "Please enter all the details compulsory !" });
                return;
            } else if (adminUser) {
                console.log("Avail data");
                res.status(400).send({ status: "error", message: "Admin already exist please enter new details !" });
                return;
            } else {
                console.log('wallet creation')
                let keys = await fabricEnrollment.registerUser(email);
                // console.log(keys, 74)
                const adminData = new superAdminDB({
                    // national_ID: national_ID,
                    email: email,
                    password: password,
                    publicKey: keys.publicKey,
                    name: name,
                    role: "superUser",
                })
                console.log(adminData, 78)
                try {
                    adminData.save((err, adminData) => {
                        if (err) {
                            res.status(400).send({ message: err });
                            return;
                        }
                        res.status(200).send({ status: "success", message: "Super User Created Successfully !", admin: adminData });
                        return
                    })
                }
                catch (err) {
                    console.log("error saving to database", err)
                }
            }
        } catch (error) {
            return res.status(400).send({ status: "Error", message: error });
        }
    }

    // //Super Admin Last login fetch
    // /**
    //     * @swagger
    //     * /Super User/super-user-last-activity:
    //     *   get:
    //     *     tags:
    //     *       - Super User
    //     *     description: Super Admin Last Login
    //     *     produces:
    //     *       - application/json
    //     *     responses:
    //     *       200:
    //     *         description: Returns success message
    //     */

    // async superAdminLastActivity(req, res, next) {
    //     try {

    //         const Data = await superAdminLogginSessionDB.find().limit(1).sort({ $natural: -1 })

    //         // const activityData = Data.createdAt
    //         // console.log(activityData);

    //         res.status(200).send({ status: "Success", Data: Data });
    //         return;

    //     } catch (error) {
    //         res.status(400).send({ status: "error", message: "Unable to find last login data." });
    //         return;
    //     }

    // }

    /**
   * @swagger
   * /superUser/singleCertificateIssue:
   *   post:
   *     tags:
   *       - Super User
   *     description: Single Issue Certificate
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: Super User Token
   *         in: header
   *         required: true
   *       - name: roll_Num
   *         description: User roll number
   *         in: formData
   *         required: true
   *       - name: first_Name
   *         description: User first name 
   *         in: formData
   *         required: true
   *       - name: last_Name
   *         description: User Last name 
   *         in: formData
   *         required: true
   *       - name: certificate_Num
   *         description: certificate Number
   *         in: formData
   *         required: true
   *       - name: year_of_Passing
   *         description: Year of Passing
   *         in: formData
   *         required: true
   *       - name: national_ID
   *         description: National ID
   *         in: formData
   *         required: true
   *       - name: document_Type
   *         description: Enter Document Type
   *         in: formData
   *         required: true
   *       - name: department
   *         description: Enter Department
   *         in: formData
   *         required: true
   *       - name: programs
   *         description: Enter Document Type
   *         in: formData
   *         required: true
   *       - name: streams
   *         description: Enter Stream
   *         in: formData
   *         required: true
   *       - name: file_Upload
   *         type: file
   *         in: formData
   *         required: true
   *         description: Upload a File
   *     responses:
   *       200:
   *         description: Returns success message
   */

    async singleCertificateIssue(req, res, next) {
        try {
            let userResult = await findSuperUser({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
            console.log(userResult, 125)
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            console.log("body: ", req.body);
            // const { roll_Num, first_Name, last_Name, certificate_Num, year_of_Passing, national_ID, document_Type, programs, department, streams } = req.body

            let url;
            console.log(req.files, 355)
            if (req.files.length != 0) {
                url = await commonFunction.getFileUrl(req.files[0].path);
            }
            console.log(url, 536)
            // let issueData = {
            //     studentEmail: req.body.studentEmail,
            //     studentName: req.body.studentName,
            //     universityName: req.session.name,
            //     universityEmail: req.session.email,
            //     major: req.body.major,
            //     departmentName:  req.body.department,
            //     cgpa: req.body.cgpa,
            //     dateOfIssuing: req.body.date,
            // };
            let certData = {
                roll_Num: req.body.roll_Num,
                first_Name: req.body.first_Name,
                last_Name: req.body.last_Name,
                certificate_Num: req.body.certificate_Num,
                year_of_Passing: req.body.year_of_Passing,
                national_ID: req.body.national_ID,
                document_Type: req.body.document_Type,
                programs: req.body.programs,
                department: req.body.department,
                streams: req.body.streams,
                doc_URL: url,
                universityEmail: userResult.email,
                universityName: userResult.name,
            }
            let serviceResponse = await universityService.issueCertificate(certData);
            console.log(serviceResponse, 390)
            const studentDB = new StudentIssueDB({
                roll_Num: serviceResponse.roll_Num,
                first_Name: serviceResponse.first_Name,
                last_Name: serviceResponse.last_Name,
                certificate_Num: serviceResponse.certificate_Num,
                year_of_Passing: serviceResponse.year_of_Passing,
                national_ID: serviceResponse.national_ID,
                document_Type: serviceResponse.document_Type,
                programs: serviceResponse.programs,
                department: serviceResponse.department,
                streams: serviceResponse.streams,
                doc_URL: serviceResponse.doc_URL,
                universityName: serviceResponse.unversityName,
                hash: serviceResponse.certHash
            });

            // console.log(studentDB, 407)
            const result = await studentDB.save();
            console.log(result, 409)
            res.status(200).send({ "status": "Saved Successfully", "result": studentDB });
            return;
        } catch (error) {
            console.log(error)
            res.status(400).send({ status: "error", message: "Unable to issue single certificate." });
            return;
        }
    }

    /**
  * @swagger
  * /superUser/batchIssueCertificate:
  *   post:
  *     tags:
  *       - Super User
  *     description: Issue Single Certificate
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: token
  *         description: superUser Token
  *         in: header
  *         required: true
  *       - name: batchName
  *         description: Batch Name
  *         in: formData
  *         required: true
  *       - name: documentType
  *         description: Document Type
  *         in: formData
  *         required: true
  *       - name: zipFile
  *         type: file
  *         in: formData
  *         required: true
  *         description: Upload a Zip File
  *       - name: csv
  *         type: file
  *         in: formData
  *         required: true
  *         description: Upload a CSV File
  *     responses:
  *       200:
  *         description: Returns success message
  */

    async batchIssueCertificate(req, res, next) {
        let userResult = await findSuperUser({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
        if (!userResult) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }

        let zipFilePath;
        let extractedStatus = false;
        let totalRecords = [];
        let unavailableCertificates = [];
        let fabricNetworkError = []
        let uploadLog = {
            unavailableCertificates, fabricNetworkError
        }
        try {
            // console.log(req.files, 356)
            if (Array.isArray(req.files) && req.files.length > 0) {
                for (let file of req.files) {
                    if (file.mimetype === "application/zip") {
                        zipFilePath = await extractArchive(file.path)
                        console.log("extracted file path:", zipFilePath, extractedStatus, typeof extractedStatus, 24);
                        extractedStatus = true;
                    }
                }
                // console.log("Extracted Fila path: ", zipFilePath);
                let directory_name = zipFilePath;
                for (let file of req.files) {
                    if (file.mimetype === "text/csv" && extractedStatus === true) {
                        // console.log(file, 357)
                        fs.createReadStream(path.join(__dirname, '../../../', '/uploads/' + file.filename))
                            .pipe(csv.parse({ headers: true }))
                            .on('error', error => console.error(error))
                            .on("data", data => {
                                totalRecords.push(data);
                            })
                            .on('end', async () => {
                                try {
                                    let extractedFilePath = path.join(__dirname, '../../../', '/')
                                    // console.log('extracted file path is', zipFilePath);
                                    // console.log("First Names are :");
                                    for (let row of totalRecords) {
                                        // console.log(row, 347)
                                        // console.log(row['File Location'],extractedFilePath + row['File Location'], 57)
                                        console.log(extractedFilePath + zipFilePath + '/' + row['File_Location'], 58)
                                        if (fs.existsSync(extractedFilePath + zipFilePath + '/' + row['File_Location'])) {
                                            //file exists
                                            console.log(row, 59)
                                            //upload to cloudinary 
                                            let url;
                                            if (extractedFilePath + zipFilePath + '/' + row['File_Location'] != 0) {
                                                url = await commonFunction.getFileUrl(extractedFilePath + zipFilePath + '/' + row['File_Location']);
                                            }
                                            console.log(url, 395)
                                            // let url = "www.demourl.com"
                                            //update into fabric network
                                            let certData = {
                                                roll_Num: row.Roll_Num,
                                                first_Name: row.First_Name,
                                                last_Name: row.Last_Name,
                                                certificate_Num: row.Certificate_Num,
                                                year_of_Passing: row.Year_of_Passing,
                                                national_ID: row.National_ID,
                                                document_Type: row.Document_Type,
                                                programs: row.Programmes,
                                                department: row.Department,
                                                streams: row.Streams,
                                                doc_URL: url,
                                                universityEmail: userResult.email,
                                                universityName: userResult.email,
                                            }
                                            let serviceResponse = await universityService.issueCertificate(certData, "superUser");
                                            if (serviceResponse) {
                                                console.log(serviceResponse, 399)
                                                //update mongodb 
                                                const studentDB = new StudentIssueDB({
                                                    roll_Num: serviceResponse.roll_Num,
                                                    first_Name: serviceResponse.first_Name,
                                                    last_Name: serviceResponse.last_Name,
                                                    certificate_Num: serviceResponse.certificate_Num,
                                                    year_of_Passing: serviceResponse.year_of_Passing,
                                                    national_ID: serviceResponse.national_ID,
                                                    document_Type: serviceResponse.document_Type,
                                                    programs: serviceResponse.programs,
                                                    department: serviceResponse.department,
                                                    streams: serviceResponse.streams,
                                                    doc_URL: serviceResponse.doc_URL,
                                                    universityName: serviceResponse.unversityName,
                                                    Hash: serviceResponse.certHash
                                                });

                                                // console.log(studentDB, 295)
                                                //update batch details object

                                                const result = await studentDB.save();

                                            } else {
                                                //update log file object for upload report
                                                console.log("error while uploading to fabric network")
                                                fabricNetworkError.push(row['National_ID'])
                                            }

                                        }
                                        else {
                                            //update log file object for upload report

                                            console.log("not not available in zip", typeof row['National_ID'], 437)
                                            //Create log file for batch upload
                                            unavailableCertificates.push(row['National_ID'])
                                            // console.log(unavailableCertificates.push(row['National_ID']), 439)
                                            // (unavailableCertificates).push(row['National_ID'])
                                            console.log(unavailableCertificates, 440)
                                        }
                                    }
                                    console.log(fabricNetworkError.length, unavailableCertificates.length, 459)
                                    if (fabricNetworkError.length == 0 && unavailableCertificates.length == 0) {
                                        //update to mongodb
                                        res.status(200).send({ status: "Saved Successfully", });
                                    } else {
                                        res.status(400).send({ status: "error", message: "Error while uploading please find the log", result: uploadLog });
                                    }

                                } catch (err) {
                                    res.status(400).json(err);
                                }
                            });
                    }
                }


            } else {
                res.status(400).send({ status: "error", message: "Files not found" });

            }


        } catch (err) {
            console.log("error in batch issue certificate:", err);
            res.status(400).send({ status: "error", message: err });
        }

    }

    /**
      * @swagger
      * /superUser/viewIssuedCertificates:
      *   post:
      *     tags:
      *       - Super User
      *     description: Issue Single Certificate
      *     produces:
      *       - application/json
      *     parameters:
      *       - name: token
      *         description: superUser Token
      *         in: header
      *         required: true
      *     responses:
      *       200:
      *         description: Returns success message
      */

    async viewIssuedCertificates(req, res, next) {
        let userResult = await findSuperUser({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
        if (!userResult) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        try {
            
            let chaincodeResult = await chaincode.invokeChaincode("queryAll",
            [mTreeHash, 
                ], false, certData.universityEmail);
        
        console.log("chaincodeResult");
    

        } catch (err) {
            console.log("error in batch issue certificate:", err);
            res.status(400).send({ status: "error", message: err });
        }

    }



}


export default new admincontroller()