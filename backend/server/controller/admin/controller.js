import Joi from "joi";
import Mongoose from "mongoose";

import _ from "lodash";
const fs = require('fs');
const path = require('path');
const csv = require('@fast-csv/parse');
import config from "config";
import apiError from "../../helper/apiError";
import response from '../../../assets/response';
const bcrypt = require('bcryptjs');
import responseMessage from '../../../assets/responseMessage';

import commonFunction from '../../helper/util';//

import jwt from "jsonwebtoken";
import status from '../../enum/status';
import auth from "../../helper/auth";
import speakeasy from 'speakeasy';
import userType from "../../enum/userType";
const { extractArchive } = require("../../services/zipOperaions")//
import { userServices } from '../../services/user';
import array from "joi/lib/types/array";
const { findUser, findSuperUser, findAdmin } = userServices;
const secret = speakeasy.generateSecret({ length: 10 });
let fabricEnrollment = require('../../services/fabric/enrollment');
const StudentIssueDB = require("../../model/student_certificate_schema")
const adminDB = require("../../model/admin.model")
const studentDB = require("../../model/student.model")
const adminLogginSessionDB = require("../../model/adminLogginSessionModel")

const universityService = require("../../services/university-service");

// const { userCheck, paginateSearch, getall, insertManyUser, createAddress, checkUserExists, emailMobileExist, createUser, findUser, updateUser, updateUserById, checkSocialLogin } = userServices;
export class admincontroller {

    // /**
    //     * @swagger
    //     * /admin/adminRegister:
    //     *   post:
    //     *     tags:
    //     *       - Admin
    //     *     description: Admin Registration
    //     *     produces:
    //     *       - application/json
    //     *     parameters:
    //     *       - name: email
    //     *         description: Admin Email
    //     *         in: formData
    //     *         required: true
    //     *       - name: password
    //     *         description: Admin Password
    //     *         in: formData
    //     *         required: true
    //     *         schema:
    //     *           $ref: '#/definitions/userLogin'
    //     *     responses:
    //     *       200:
    //     *         description: Returns success message
    //     */

    // async adminRegister(req, res, next) {
    //     const { email, password } = req.body;
    //     console.log(req.body);
    //     try {
    //         console.log('adminregister')
    //         const adminUser = await adminDB.findOne({ email: email, password: password })
    //         console.log(adminUser, 63);
    //         if (email === "" && password === "" && email === null && password === null && email === undefined && password === undefined) {
    //             console.log("null data");
    //             res.status(400).send({ status: "error", message: "Please enter all the details compulsory !" });
    //             return;
    //         } else if (adminUser) {
    //             console.log("Avail data");
    //             res.status(400).send({ status: "error", message: "Admin already exist please enter new details !" });
    //             return;
    //         } else {
    //             console.log('wallet creation')
    //             let keys = await fabricEnrollment.registerUser(email);
    //             // console.log(keys, 74)
    //             const adminData = new adminDB({
    //                 // national_ID: national_ID,
    //                 email: email,
    //                 password: password,
    //                 publicKey: keys.publicKey
    //             })
    //             console.log(adminData, 78)
    //             try {
    //                 adminData.save((err, adminData) => {
    //                     if (err) {
    //                         res.status(400).send({ message: err });
    //                         return;
    //                     }
    //                     res.status(200).send({ status: "success", message: "Admin Created Successfully !", admin: adminData });
    //                     return
    //                 })
    //             }
    //             catch (err) {
    //                 console.log("error saving to database", err)
    //             }
    //         }
    //     } catch (error) {
    //         return res.status(400).send({ status: "Error", message: error });
    //     }
    // }

    /**
        * @swagger
        * /admin/adminSignin:
        *   post:
        *     tags:
        *       - Admin
        *     description: Admin Login
        *     produces:
        *       - application/json
        *     parameters:
        *       - name: email
        *         description: Admin Email
        *         in: formData
        *         required: true
        *       - name: password
        *         description: Admin Password
        *         in: formData
        *         required: true
        *     responses:
        *       200:
        *         description: Returns success message
        */

    async adminSignin(req, res, next) {
        const { email,
            password } = req.body;

        try {
            const user = await adminDB.findOne({ email: email })

            const Password = user.password


            if (email === "" && email === null && email === undefined) {
                console.log("null data");
                res.status(400).send({ status: "error", message: "Please enter Admin ID !" });
                return;
            } else if (user) {
                if (password === Password) {
                    const token = jwt.sign({ id: user._id }, config.get("jwtsecret"), { expiresIn: "1h" });

                    const loginData = new adminLogginSessionDB({
                        ID: user._id,
                        Token: token
                    })
                    loginData.save();

                    res.status(200).send({ status: "success", message: `Successfully  Login`, user: user, Token: token });
                    return;
                } else {
                    res.status(400).send({ status: "error", message: "Password Not Matched." });
                    return;
                }
            } else {
                res.status(400).send({ status: "error", message: "User Not found" });
                return;
            }
        } catch (error) {
            res.status(400).send({ status: "error", message: "User Not found" });
            return;
        }
    }

    /**
   * @swagger
   * /admin/singleCertificateIssue:
   *   post:
   *     tags:
   *       - Admin
   *     description: Single Issue Certificate
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: Admin Token
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
            let userResult = await findAdmin({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
            if (!userResult) {
                throw apiError.notFound(responseMessage.USER_NOT_FOUND);
            }
            console.log("body: ", userResult, 244);
            console.log("files: ", req.files, 241)
            const { roll_Num, first_Name, last_Name, certificate_Num, year_of_Passing, national_ID, document_Type, programs, department, streams } = req.body

            let url;
            if (req.files.length != 0) {
                url = await commonFunction.getFileUrl(req.files[0].path);
            }
            console.log(url, 536)
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
                universityName: userResult.universityName,
            }
            let serviceResponse = await universityService.issueCertificate(certData, "admin");

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

            console.log(studentDB, 295)
            const result = await studentDB.save();
            res.status(200).send({ status: "Saved Successfully", result: studentDB });
            return;



        } catch (error) {
            console.log(error)
            res.status(400).send({ status: "error", message: "Unable to issue single certificate." });
            return;
        }
    }

    /**
   * @swagger
   * /admin/batchIssueCertificate:
   *   post:
   *     tags:
   *       - Admin
   *     description: Issue Single Certificate
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: token
   *         description: Admin Token
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
        let userResult = await findAdmin({ _id: req.userId, userType: { $in: [userType.USER, userType.EXPERT, userType.AGENT] } });
        if (!userResult) {
            throw apiError.notFound(responseMessage.USER_NOT_FOUND);
        }
        console.log(userResult, 338)
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
                                        console.log(row, 347)
                                        console.log(row['File_Location'],extractedFilePath + row['File File_Location'], 378)
                                        console.log(extractedFilePath + zipFilePath + '/' + row['File_Location'], 379)
                                        console.log(extractedFilePath + zipFilePath + '/' + row['File_Location'], 380)
                                        if (fs.existsSync(extractedFilePath + zipFilePath + '/' + row['File_Location'])) {
                                            //file exists
                                            console.log(row, 59)
                                            //upload to cloudinary 
                                            let url;
                                            if (extractedFilePath + zipFilePath + '/' + row['File_Location'] != 0) {
                                                url = await commonFunction.getFileUrl(extractedFilePath + zipFilePath + '/' + row['File_Location']);
                                            }
                                            // console.log(url, 395)
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
                                                universityName: userResult.universityName,
                                            }
                                            let serviceResponse = await universityService.issueCertificate(certData, "admin");
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
                                                //update batch db

                                                const result = await studentDB.save();
                                            } else {
                                                //update log file object for upload report
                                                console.log("error while uploading to fabric network")
                                                fabricNetworkError.push(row['National_ID'])
                                            }

                                        }
                                        else {
                                            //update log file object for upload report

                                            console.log("not available in zip", row['File_Location'], 437)
                                            //Create log file for batch upload
                                            unavailableCertificates.push(row['National_ID'])
                                            // console.log(unavailableCertificates.push(row['National_ID']), 439)
                                            // (unavailableCertificates).push(row['National_ID'])
                                            console.log(unavailableCertificates, 440)
                                        }
                                    }
                                    console.log(fabricNetworkError.length, unavailableCertificates.length, 459)
                                    if (fabricNetworkError.length == 0 && unavailableCertificates.length == 0) {
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
}


export default new admincontroller()

// "ccpPath": "/home/ubuntu/appbeez-certvalut/appbeez-certvalut-mvp-21114048-cpp-pune/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json",
// "walletPath": "/home/ubuntu/appbeez-certvalut/appbeez-certvalut-mvp-21114048-cpp-pune/wallet",
