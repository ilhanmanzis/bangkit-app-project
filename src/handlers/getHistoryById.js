import { Firestore } from "@google-cloud/firestore";

const dbf = new Firestore();

const getHistoryById = async(request, h)=>{
    const idUser = `${request.user.id}`;
    const idHistory = request.params.idHistory;

    try {
        // Referensi ke dokumen tertentu dalam subkoleksi `history`
        const historyDoc = dbf.collection('users').doc(idUser).collection('history').doc(idHistory);

        // Mendapatkan data dokumen
        const doc = await historyDoc.get();

        // Cek apakah dokumen ada
        if (!doc.exists) {
            console.log(`History dengan ID ${idHistory} untuk user ${idUser} tidak ditemukan.`);
            return h.response({
                status: 'fail',
                message: {  
                    errors:{
                        history:[`History dengan ID ${idHistory} tidak ditemukan.`]
                    }
                },
                data: null
            }).code(404);
        }

        // Data ditemukan
        const historyData = doc.data();
        return h.response({
            status: 'success',
            message: 'Data history berhasil ditemukan.',
            data: {
                ...historyData // Data dokumen
            }
        }).code(200);

    } catch (error) {
        console.error("Error saat mengambil data history:", error.message);
        return h.response({
            status: 'fail',
            message: 'Internal Server Error',
            data: null
        }).code(500);
    }
}

export default getHistoryById;