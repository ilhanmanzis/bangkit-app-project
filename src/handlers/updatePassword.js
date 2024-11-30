import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export const updatePassword = async (request, h) => {
  const { id } = request.user; // ID pengguna dari token
  const { oldPassword, newPassword, confirmNewPassword } = request.payload;

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

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return h.response({ 
        status:'fail',
        message:{
          errors: {
            oldPassword:['Password lama salah']
          }
        },
        data:null
      }).code(401);
    }

     //membuat enkripsi password
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt); // Enkripsi password baru
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, id]);

    return h.response({ 
      status:'success',
      message: 'Password berhasil diubah',
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
