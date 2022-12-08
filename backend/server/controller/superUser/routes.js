import Express from "express";
import controller from "./controller";
import auth from "../../helper/auth";
import upload from "../../helper/uploadHandler"


export default Express.Router()
  .post('/superUserSignin', controller.superUserSignin)
  .post('/superUserRegister', controller.superUserRegister)
  .use(auth.verifyTokenSuperUser)
  .post('/createAdmin', controller.createAdmin) 

  .use(auth.verifyTokenSuperUser)
  .use(upload.uploadFile)
  .post('/singleCertificateIssue', controller.singleCertificateIssue)
  .post('/batchIssueCertificate', controller.batchIssueCertificate)
  // .get('/student-last-activity', controller.studentLastActivity)
  // .get('/User-last-activity', controller.UserLastActivity)
  // .get('/super-User-last-activity', controller.superUserLastActivity)


