import axios from "axios";
import fs from "fs";
import path from "path";
import {getOrCreateBucket, upload} from "../services/upload.js";
import predictModel from "../services/predictModel.js";
import { nanoid } from "nanoid";
import getCurrentDate from "../services/currentDate.js";
import store_data from "../services/saveFireStore.js";
import renameMakanan from "../services/renameMakanan.js";

import crypto from "crypto";



const scan = async(request, h)=>{
    const { photo } = request.payload;
    const image = photo;
    if (!image) {
        return h.response({
            status: 'fail',
            message: {
                errors:{image:['image tidak ditemukan']}
            },
            data:null
        }).code(400);
    }
    let imageName;

    if(image.filename){
        imageName = image.filename
    }else{
        imageName = crypto.randomBytes(Math.ceil(length / 2)) // Menghasilkan byte random
        .toString('hex') // Mengubah byte menjadi string heksadesimal
        .slice(0, length); // Memotong sesuai panjang yang diinginkan
    }

    console.log('request.payload:', imageName);
    
    
    
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

        if(hasil.confidence_score < 10){
            return h.response({
                status: 'fail',
                message: {
                    errors: { makanan: ['Makanan tidak dikenali.'] }
                },
                data: null
            }).code(400); 
        }

        //mengubah nama makanan sesuai EYD
        const namaMakanan = await renameMakanan(hasil.model_prediction);


        if (!namaMakanan) {
            return h.response({
                status: 'fail',
                message: {
                    errors: { makanan: ['Makanan tidak dikenali.'] }
                },
                data: null
            }).code(400); 
        }

        const bucket = await getOrCreateBucket(bucketName);


        // Upload gambar ke Google Cloud Storage
        const fileUrl = await upload(image.path, bucket, request.user.id, imageName);
        const today = getCurrentDate();
        const idHistory = nanoid(12);
        //menyimpan data ke firestore
        const historyData = {
            id_history:idHistory,
            makanan:namaMakanan,
            kalori:hasil.calories,
            confidence_score: hasil.confidence_score,
            tanggal: today,
            image: fileUrl,
        };

        await store_data(`${request.user.id}`, idHistory, historyData);

        // Hapus file sementara setelah diproses
        fs.unlinkSync(image.path);
        
        return h.response({
            status: 'success',
            message:'Gambar Berhasil Diprediksi',
            data:{
                makanan: namaMakanan,
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