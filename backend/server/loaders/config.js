// //add configuration files
// //initialize environment variables
// //try to use the export from this file instead of touching process.env directly.


// const env = process.env.NODE_ENV || 'development';

// if (env === 'development') {
//     process.env.MONGODB_URI = process.env.MONGODB_URI_LOCAL;  //in case of dev, connect to local URI.
//     process.env.NODE_ENV = 'development';
// }


// module.exports = {
//     mongodbURI: "mongodb://localhost:27017/blockchaincertificate",
//     port: 3000,
//     logLevel: process.env.LOG_LEVEL || "info",
//     expressSessionSecret: "sdfsdfddfgdfg3242efDFHI234",


//     fabric: {
//         ccpPath: "/home/administrator/Desktop/certvault/blockchain-academic-certificates-master/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json",
//         walletPath: require('path').resolve(__dirname, "..", "wallet"),
//         channelName :"mychannel",
//         chaincodeName : "basic"
//     }
// };




