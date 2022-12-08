'use strict';


class Certificate {
    /**
     * constructor for the certificate transaction object. This will be written to the blockchain ledger for each
     * certificate issued. 
     *  
     * @param {String} certHash - Hash created from the certificate data. 
     * @param {String} universitySignature - Signature of @certHash signed by private key of issuer(university)
     * @param {String} studentSignature - Signature of @certHash signed by private key of holder(student)
     * @param {String} dateOfIssuing - Date the certificate was issued
     * @param {String} certUUID - UUID for a certificate (automatically generated. Must match with database entry)
     * @param {String} universityPK - Public key or public ID of issuer account
     * @param {String} studentPK - Public key or public ID of student account 
     */
    //  const certificate = new Certificate(certHash, universitySignature, studentSignature,  roll_Num,first_Name,last_Name,certificate_Num,year_of_Passing,national_ID,document_Type,programs,department,streams,doc_URL,universityEmail, unversityName, universityPK, studentPK);

     //todo: universityPK and studentPK should ideally be public keys. If you can't accomplish this, look into using 
     // some kind of UUID instead. 
    constructor(certHash, universitySignature, studentSignature,  roll_Num,first_Name,last_Name,certificate_Num,year_of_Passing,national_ID,document_Type,programs,department,streams,doc_URL,universityEmail, unversityName, universityPK, studentPK) {
        this.certHash = certHash;
        this.universityPK = universityPK;
        this.studentPK = studentPK;
        this.roll_Num = roll_Num;
        this.first_Name = first_Name;
        this.last_Name = last_Name;
        this.certificate_Num = certificate_Num;
        this.year_of_Passing = year_of_Passing;
        this.national_ID = national_ID;
        this.document_Type = document_Type;
        this.programs = programs;
        this.department = department;
        this.streams = streams;
        this.doc_URL= doc_URL;
        this.universityEmail= universityEmail; 
        this.unversityName= unversityName;
        this.universitySignature = universitySignature;
        this.studentSignature = studentSignature;
        this.dataType = "certificate"
    }

   

    /**
     * Instantiate object from json argument. 
     * @param {json} data json data of a Product instance 
     * @returns {Certificate} instantiated Certificate object. 
     */

    static deserialize(data) {
        return new Certificate(data.certHash, 
            data.universitySignature, 
            data.studentSignature, 
            data.first_Name, 
            data.last_Name, 
            data.certificate_Num, 
            data.year_of_Passing,
            data.national_ID,
            data.document_Type,
            data.programs,
            data.department,
            data.streams,
            data.doc_URL,
            data.universityEmail,
            data.unversityName,);
    }
    

    //todo: Add validation of some kind to see that the signatures match and stuff. (LATER)
}

module.exports = Certificate;


// peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"issueCertificate","Args":[]}'
