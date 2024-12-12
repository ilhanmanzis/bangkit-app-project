const renameMakanan = async(makanan)=>{
    const class_labels = ['ayam bakar', 'ayam_goreng', 'ayam_pop', 'bakso', 'daging_rendang','dendeng_batakok', 'gado_gado', 'grontol', 'gulai_ikan', 'gulai_tambsu','gulai_tunjang', 'lanting', 'lumpia', 'putu_ayu', 'serabi_solo', 'telur_balado', 'telur_dadar', 'wajik']

    const nama = ["Ayam Bakar", "Ayam Goreng", "Ayam Pop", "Bakso", "Daging Rendang","Dendeng Batakok", "Gado Gado", "Grontol", "Gulai Ikan", "Gulai Tambsu","Gulai Tunjang", "Lanting", "Lumpia", "Putu Ayu", "Serabi Solo", "Telur Balado", "Telur Dadar", "Wajik"]
        
    // Cari index dari `makanan` di array class_labels
    const index = class_labels.indexOf(makanan);
    
    // Jika ditemukan, kembalikan nilai dari array `nama`, jika tidak kembalikan null
    if (index !== -1) {
        return nama[index];
    } else {
        return null; // Atau Anda bisa mengembalikan pesan default seperti 'Makanan tidak ditemukan'
    }
}


export default renameMakanan;