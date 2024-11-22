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
        request_id:id,
        errors: {
            id:[
                'User not found'
            ]
      }}).code(404);
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return h.response({ errors: {
        oldPassword:['Password lama salah']
      } }).code(401);
    }

     //membuat enkripsi password
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt); // Enkripsi password baru
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, id]);

    return h.response({ message: 'Password berhasil diubah' }).code(200);
  } catch (error) {
    console.error(error);
        return h.response({ errors:{
            server:[
                'Internal server error'
            ]
        }}).code(500);
  }
};
