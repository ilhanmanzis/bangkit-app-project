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

        // Memproses data menjadi array dengan atribut yang diperlukan saja
        const histories = snapshot.docs.map(doc => {
                const { id_history, makanan, kalori, image } = doc.data();
                return { id_history, makanan, kalori, image }; // Hanya menyertakan atribut tertentu
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