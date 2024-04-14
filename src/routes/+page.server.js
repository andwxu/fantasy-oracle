import { Storage } from "@google-cloud/storage";
import fs from "fs";
console.log('at start of index.js');
/**
* TODO(developer): Uncomment the following lines before running the sample.
*/
// The ID of your GCS bucket
const bucketName = 'oracle-c2281.appspot.com';

// The ID of your GCS file
const fileName = 'stats.csv';

// The path to which the file should be downloaded
const destFileName = './stats.csv';

// Creates a client
const storage = new Storage();

async function downloadFile() {
    const options = {
        destination: destFileName,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);

    console.log(
        `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    );
}

fs.access(fileName, 0, (err) => {
    if (err) {
        downloadFile().catch(console.error);
    }
});