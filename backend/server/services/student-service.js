
const certificates = require('../model/student_certificate_schema');
const students = require('../model/student.model');
const chaincode = require('./fabric/chaincode');
const logger = require("./logger");
const encryption = require('./encryption');
const certificateService = require('./certificate-service');




async function getCertificateDataforDashboard(studentPublicKey, studentEmail) {


    let certLedgerDataArray = await chaincode.invokeChaincode("getAllCertificateByStudent",
        [studentPublicKey], true, studentEmail);
        console.log(certLedgerDataArray, 17);
    // let certUUIDArray = certLedgerDataArray.map( element => {
    //     return element.certUUID
    // });
    return certLedgerDataArray
    // let certDBRecords = await certificates.find().where('_id').in(certUUIDArray).exec();

    // return certificateService.mergeCertificateData(certDBRecords, certLedgerDataArray);
}


module.exports = {getCertificateDataforDashboard}