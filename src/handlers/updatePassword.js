import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export const updatePassword = async (request, h) => {
  const { id } = request.user; // ID pengguna dari token
  const { oldPassword, newPassword } = request.payload;

  try {
    // Ambil password pengguna dari database
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return h.response({ message: 'User not found' }).code(404);
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return h.response({ message: 'Old password is incorrect' }).code(401);
    }

    // Enkripsi password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, id]);

    return h.response({ message: 'Password updated successfully' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};
