import axios from "axios";
import fs from "fs";
import path from "path";
import {getOrCreateBucket, upload} from "../services/upload.js";
import predictModel from "../services/predictModel.js";



const scan = async(request, h)=>{
    const { image } = request.payload;
    const imageName = image.filename;
    console.log('request.payload:', imageName);
    if (!image) {
        return h.response({ message: 'image tidak ditemukan' }).code(400);
    }
    
    
    //nama bucket
    const bucketName = process.env.BUCKET_NAME;

    try {
        // Validasi tipe file
        const validMimeTypes = ['image/jpeg', 'image/png'];
        if (!validMimeTypes.includes(image.headers['content-type'])) {
            return h.response({ status: 'fail', 
                message:{
                    errors:{
                        image:['Format gambar tidak valid. Hanya mendukung JPEG/PNG.']
                    }
                },
                data:null  
            }).code(400);
        }
         // Baca file sebagai buffer
        const imageBuffer = fs.readFileSync(image.path);

        // Konversi ke Base64
        const base64Image = imageBuffer.toString('base64');

        //prediksi ke model
        const hasil = await predictModel(image, base64Image);

        const bucket = await getOrCreateBucket(bucketName);


        // Upload gambar ke Google Cloud Storage
        const fileUrl = await upload(image.path, bucket, request.user.id, imageName);

        // Hapus file sementara setelah diproses
        fs.unlinkSync(image.path);
        return h.response({
            status: 'success',
            message:'Gambar Berhasil Diprediksi',
            data:{
                makanan: hasil.model_prediction,
                kalori: hasil.calories,
                confidence_score: hasil.confidence_score,
                image: fileUrl
            }
    }).code(200);
    } catch (error) {
         // Hapus file sementara jika ada error
        if (fs.existsSync(image.path)) {
            fs.unlinkSync(image.path);
        }

        console.error('Error selama pemrosesan:', error.message);
        return h.response({
            status: 'fail',
            message: {
                errors:{
                    image:['Terjadi kesalahan selama pemrosesan gambar.']
                }
            },
            data: null,
        }).code(500);
    }

}

export default scan;