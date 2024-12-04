import { Firestore } from "@google-cloud/firestore";

const dbf = new Firestore();
const getAllHistory = async(request, h)=>{
    const id = `${request.user.id}`;

    try {
        const historyCollection = dbf.collection('users').doc(id).collection('history');

    const snapshot = await historyCollection.get();
    if (snapshot.empty) {
        console.log(`Tidak ada data history untuk user dengan ID ${id}.`);
        return h.response({
            status:'fail',
            message:'data history tidak ditemukan',
            data:[]
        }).code(404);
    }

    // Memproses data menjadi array
        const histories = [];
        snapshot.forEach(doc => {
            histories.push({
                ...doc.data(), // Data dokumen
            });
        });
        return h.response({
            status:'success',
            message:'data history berhasil ditemukan',
            data:histories
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status:'fail',
            message:'Internal Server Error',
            data:null
        }).code(500);   
    }

}

export default getAllHistory