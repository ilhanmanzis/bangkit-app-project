import db from '../config/db.js';

export const updateProfile = async (request, h) => {
  const { id } = request.user; // ID pengguna dari token
  const { nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan } = request.payload;

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

    // Periksa apakah email sudah digunakan oleh pengguna lain
    const [emailCheck] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
    if (emailCheck.length > 0) {
      return h.response({ 
        request_email:email,
        errors: {
            email:[
                'Email is already in use by another user'
            ]
      }}).code(400);
    }

    // Update profil pengguna
    await db.query(
      `UPDATE users 
       SET nama = ?, email = ?, jenis_kelamin = ?, tanggal_lahir = ?, berat_badan = ?, tinggi_badan = ? 
       WHERE id = ?`,
      [nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan, id]
    );

    return h.response({ message: 'Profile updated successfully' }).code(200);
  } catch (error) {
    console.error(error);
        return h.response({ errors:{
            server:[
                'Internal server error'
            ]
        }}).code(500);
  }
};
