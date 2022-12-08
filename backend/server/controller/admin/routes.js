import Express from "express";
import controller from "./controller";
import auth from "../../helper/auth";

import upload from "../../helper/uploadHandler"


export default Express.Router()
  // .post('/adminRegister', controller.adminRegister)
  .post('/adminSignin', controller.adminSignin)
  
  .use(auth.verifyTokenAdmin)
  .use(upload.uploadFile)
  .post('/singleCertificateIssue', controller.singleCertificateIssue)
  .post('/batchIssueCertificate', controller.batchIssueCertificate)
