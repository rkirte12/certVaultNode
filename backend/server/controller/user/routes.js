import Express from "express";
import controller from "./controller";
import auth from "../../helper/auth";
import upload from "../../helper/uploadHandler"


export default Express.Router()
    .post('/userRegister', controller.userRegister)
    .post('/userSignin',controller.userSignin)

    .use(auth.verifyTokenUser)
    .get('/viewCertificate', controller.viewCertificate)
    // .get('/downloadCertificate', controller.downloadCertificate)
    // .get('/dashboard', controller.dashboard)

   


