import { Firestore } from "@google-cloud/firestore";

const dbf = new Firestore();

async function store_data(idUser, idHistory, historyData) {
    try {

         // Koleksi "users"
        const userCollection = dbf.collection('users');
        console.log('Collection users tersedia.');

        // Dokumen user berdasarkan idUser
        const userDoc = userCollection.doc(idUser);
        console.log(`Dokumen untuk user ${idUser} tersedia.`);

        // Subcollection "history"
        const historyCollection = userDoc.collection('history');
        const historyDoc = historyCollection.doc(idHistory);

        // Menyimpan data ke Firestore
        await historyDoc.set(historyData);
        console.log(`Data history dengan ID ${idHistory} berhasil ditambahkan.`);
    } catch (error) {
        console.error("Error saat menyimpan data:", error.message);
    }
}


export default store_data;