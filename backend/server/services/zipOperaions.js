const AdmZip = require("adm-zip");
const path = require("path");
module.exports = {
    // createZipArchive(); 
    createZipArchive: async function createZipArchive() {
        try {
            const zip = new AdmZip();
            const outputFile = "test.zip";
            zip.addLocalFolder("./test");
            zip.writeZip(outputFile);
            console.log(`Created ${outputFile} successfully`);
        } catch (e) {
            console.log(`Something went wrong. ${e}`);
        }
    },

    // readZipArchive("./test.zip");
    readZipArchive: async function readZipArchive(filepath) {
        try {
            const zip = new AdmZip(filepath);

            for (const zipEntry of zip.getEntries()) {
                console.log(zipEntry.toString());
            }
        } catch (e) {
            console.log(`Something went wrong. ${e}`);
        }
    },

    //   extractArchive("./test.zip");
    extractArchive: async function extractArchive(filepath) {
        try {
            // console.log("Unziping the files==>",filepath, 32)
            var directory = '';
            const zip = new AdmZip(filepath);
            const outputDir = `${path.parse(filepath).name}`;
            directory =`public/`+outputDir;
            zip.extractAllTo(directory);
            // console.log(`Extracted to "${outputDir}" successfully`, directory,39);
            return directory;
        } catch (e) {
            console.log(`Something went wrong. ${e}`);
        }
    }

}