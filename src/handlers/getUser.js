import db from "../config/db.js";

const getUser = async(request, h) =>{
    const id = request.user.id;

    try {
       // Periksa apakah pengguna dengan ID yang diberikan ada
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return h.response({
        status:'fail' ,
        message:{
            errors: {
                id:[
                    'User tidak ditemukan'
                ]
            }
        },
        data:{
            request_id:id,
        }
        }).code(404);
    }

    const user = rows[0];
     // Format respons dengan data pengguna

    return h.response({
        status:'success',
        message:'Data profil berhasil didapatkan',
        data: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            jenisKelamin: user.jenis_kelamin,
            tanggalLahir: user.tanggal_lahir,
            beratBadan: user.berat_badan,
            tinggiBadan: user.tinggi_badan,
        }
    }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status:'fail',
            message:'Internal Server Error',
            data:null
        }).code(500);
    }
};

export default getUser;