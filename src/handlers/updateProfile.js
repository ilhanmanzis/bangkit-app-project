import db from '../config/db.js';

export const updateProfile = async (request, h) => {
  const { id } = request.user; // ID pengguna dari token
  const { nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan } = request.payload;

  try {
     // Periksa apakah pengguna dengan ID yang diberikan ada
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return h.response({ 
        status:'fail',
        message:{
          errors: {
            id:[
                    'User tidak ditemukan'
                ]
          }
        },
        data:null
      }).code(404);
    }

    // Periksa apakah email sudah digunakan oleh pengguna lain
    const [emailCheck] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
    if (emailCheck.length > 0) {
      return h.response({ 
        status:'fail',
        message:{
          errors: {
            email:[
                'Email sudah digunakan'
            ]
          }
        },
        data:{
          request_email:email,
        }
      }).code(400);
    }

    // Update profil pengguna
    await db.query(
      `UPDATE users 
       SET nama = ?, email = ?, jenis_kelamin = ?, tanggal_lahir = ?, berat_badan = ?, tinggi_badan = ? 
       WHERE id = ?`,
      [nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan, id]
    );

    return h.response({ 
      status:'success',
      message: 'Profile user berhasil diperbarui' ,
      data:null
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
