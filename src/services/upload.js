import { Storage } from "@google-cloud/storage";
import getFormattedFileName from "./formatFile.js";

const storage = new Storage();



async function getOrCreateBucket(bucketName){
    const bucket = await storage.bucket(bucketName);
    try {
        const [metadata] = await bucket.getMetadata();
        console.log(`Bucket ${metadata.name} sudah tersedia!`);
        return bucket;
    } catch (error) {
        const optionsCreateBucket = {
            location: 'ASIA-SOUTHEAST2'
        }

        //CREATE BUCKET
        await storage.createBucket(bucketName, optionsCreateBucket);
        console.log(`${bucketName} bucke created successfully`);
        return bucket;
    }
};


async function upload(filePath, bucket, userId, imageName){
    const newFileName = getFormattedFileName(imageName);
    try {
        const customMetadata = {
            contentType: 'image/jpeg',
            metadata: {
                type: 'header/logo'
            }
        }

        const optionsObject={
            destination: `${userId}/${newFileName}`,
            preconditionOpts : {ifGenerationMath:0},
            metadata: customMetadata
        }

        await bucket.upload(filePath, optionsObject);
        //console.log(`${filePath} uploaded to ${bucket.name} bucket`);

         // Generate URL public
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${optionsObject.destination}`;
        //console.log(`${filePath} uploaded to ${bucket.name} bucket at ${fileUrl}`);
        return fileUrl;
    } catch (error) {
        console.error(`Gagal mengupload ${filePath}:`, error.message);
    }
    
}








export  {getOrCreateBucket, upload};