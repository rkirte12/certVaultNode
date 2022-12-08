'use strict';


class adminRoles {
    /**
     * constructor for the admin roles to set default rules to each admin created.
     * 
     */
    constructor() {
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

    static deserialize(data) {
        return new adminRoles(data.certHash, 
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

}

module.exports = adminRoles;


// const roleSchema :{
//     DashBoard: {
//         Notifications: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         MyActivities: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//     },
//     Documents: {
//         Issue: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         BatchUpload: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         Search: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//     },
//     IdentityManagaement: {
//         KYC: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         Biometric: {
//         CreateUser: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         ManagerUser: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         Roles: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//     },
// };        FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//     },
//     Administration: {
//         CreateUser: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         ManagerUser: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//         Roles: {
//             FullAccess: { type: Boolean, required: true, default: false },
//             ReadOnly: { type: Boolean, required: true, default: false },
//             WholeAccess: { type: Boolean, required: true, default: false }
//         },
//     },
// };
