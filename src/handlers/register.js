import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Register handler
export const register = async (request, h) => {
  const { nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan, password} = request.payload;

  try {
    //cek email apakah sudah ada?
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log(existingUser);
    if (existingUser.length > 0) {
      return h.response({ message: 'Email sudah terdaftar' }).code(400);
    }

    

    //membuat enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10); // Enkripsi password

    //menyimpan data user
    await db.query(
      `INSERT INTO users (nama, email, jenis_kelamin, tanggal_lahir, berat_badan, tinggi_badan, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan, hashedPassword]
    );

    return h.response({ message: 'User registered successfully' }).code(201);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};
