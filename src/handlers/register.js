import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Register handler
const register = async (request, h) => {
  const { nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan, password} = request.payload;

  try {
    //cek email apakah sudah ada?
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return h.response({ errors: {
          email :[
            'Email sudah terdaftar'
          ]
        }
      }).code(400);
    }

    

    //membuat enkripsi password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt); // Enkripsi password

    //menyimpan data user
    await db.query(
      `INSERT INTO users (nama, email, jenis_kelamin, tanggal_lahir, berat_badan, tinggi_badan, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, email, jenisKelamin, tanggalLahir, beratBadan, tinggiBadan, hashedPassword]
    );

    return h.response({ message: 'User berhasil terdaftar' }).code(201);
  } catch (error) {
    console.error(error);
    return h.response({ errors:{
      server:[
        'Internal server error'
      ]
    }}).code(500);
  }
};

export default register;