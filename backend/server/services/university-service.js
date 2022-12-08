const universities = require('../model/superAdmin.model');
const admins = require('../model/admin.model');
const certificates = require('../model/student_certificate_schema'); 
const students = require('../model/student.model');
const chaincode = require('./fabric/chaincode');
// const logger = require("./logger");
const encryption = require('./encryption');
const certificateService = require('./certificate-service');

/**
 * Create certificate object in database and ledger.
 * For ledger - data needs to be cryptographically signed by student and university private key.
 * @param {certificates.schema} certData
 * @returns {Promise<{}>}
 */
async function issueCertificate(certData, userType) {
    console.log(certData, 16)
    let universityObj
    try{
        if(userType == 'admin'){
            universityObj = await admins.findOne({"email": certData.universityEmail});
        }else{
            universityObj = await universities.findOne({"email": certData.universityEmail});
        }
        let studentObj = await students.findOne({"national_ID": certData.national_ID});
    
        if (!studentObj) throw new Error("Could not fetch student profile. Provide valid student email.");
        if (!universityObj) throw new Error("Could not fetch university profile.");
        // console.log(studentObj, 22)
        // console.log(universityObj, 23)
        let certDBModel = new certificates(certData);
        // console.log(certDBModel, 24)
        let mTreeHash =  await encryption.generateMerkleRoot(certDBModel);
        // console.log(mTreeHash, 27)
        let universitySignature = await encryption.createDigitalSignature(mTreeHash, certData.universityEmail);
        let studentSignature = await encryption.createDigitalSignature(mTreeHash, studentObj.student_Email_ID);
        // console.log(universitySignature, 28)
        // console.log(studentSignature, 29)
        // ctx, certHash, universitySignature, studentSignature, dateOfIssuing, roll_Num,first_Name,last_Name,certificate_Num,year_of_Passing,national_ID,document_Type,programs,department,streams,doc_URL,universityEmail, universityName, universityPK, studentPK) {
        // certHash, universitySignature, studentSignature, certUUID,roll_Num,first_Name,last_Name,certificate_Num,year_of_Passing,national_ID,document_Type,programs,department,
        // streams,doc_URL,universityEmail, unversityName, universityPK, studentPK
        // proposal response: version:1 
        // response:<status:200 payload:"{\"certificateType\":\"university degree\",\"id\":\"v1\",\"ordering\":[\"roll_Num\",\"first_Name\",\"last_Name\",\"certificate_Num\",\"year_of_Passing\",\"national_ID\",\"document_Type\",\"programs\",\"department\",\"streams\",\"doc_URL\",\"universityEmail\",\"universityName\"],\"dataType\":\"schema\"}"
        let chaincodeResult = await chaincode.invokeChaincode("issueCertificate",
            [mTreeHash, 
                universitySignature, 
                studentSignature, 
                certDBModel['roll_Num'], 
                certDBModel['first_Name'],  
                certDBModel["last_Name"], 
                certDBModel["certificate_Num"],
                certDBModel["year_of_Passing"],
                certDBModel["national_ID"],
                certDBModel["document_Type"],
                certDBModel["programs"],
                certDBModel["department"],
                certDBModel["streams"],
                certDBModel["doc_URL"],
                certDBModel["universityEmail"],
                certDBModel["universityName"],
                universityObj.publicKey, 
                studentObj.publicKey ], false, certData.universityEmail);
        
        console.log("chaincodeResult");
    
    
        let CertificateHash = chaincodeResult;
        // console.log(chaincodeResult);
        return chaincodeResult;
    }catch(err){
        console.log("error==>71", err)
        return err
    }
    

    // let res = await certDBModel.save();
    // if(!res) throw new Error("Could not create certificate in the database");

    // return true; //If no errors were thrown, everything completed successfully.
    // }
}

/**
 * Fetch and return all certificates issued by a specific university
 * @param {String} universityName
 * @param {String} universtiyEmail
 * @returns {Promise<certificates[]>}
 */
async function getCertificateDataforDashboard(universityName, universtiyEmail) {
    let universityProfile = await chaincode.invokeChaincode("queryUniversityProfileByName",
        [universityName], true, universtiyEmail);

    let certLedgerDataArray = await chaincode.invokeChaincode("getAllCertificateByUniversity",
        [universityProfile.publicKey], true, universtiyEmail);

    let certUUIDArray = certLedgerDataArray.map( element => {
        return element.certUUID
    });

    let certDBRecords = await certificates.find().where('_id').in(certUUIDArray).exec();

    return certificateService.mergeCertificateData(certDBRecords, certLedgerDataArray);
}


module.exports = {issueCertificate,  getCertificateDataforDashboard};