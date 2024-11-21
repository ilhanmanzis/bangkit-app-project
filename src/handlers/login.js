import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';




// Login handler (sudah ada sebelumnya)
const login = async (request, h) => {
  const { email, password } = request.payload;

  try {
    //mencari data user
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return h.response({ errors: {
        email :['User tidak ditemukan']
      } }).code(404);
    }

    const user = rows[0];

    //validasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return h.response({ errors: {
        password:['Password Salah']
      } }).code(401);
    }


    //membuat token JWT
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_TOKEN });

    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_ACCESS_TOKEN });

    // Update refresh_token di database
    await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);



    return h.response({ 
      message: 'Login berhasil',
      data:{
        accessToken,
        //refreshToken //jika refresh token disimpan dalam payload
      } 
    })
    .state('refreshToken', refreshToken, {
        //isSecure: true, // Gunakan true untuk HTTPS
        httpOnly: true, // Mencegah akses dari JavaScript
        path: '/', // Berlaku untuk seluruh domain
        ttl: 24 * 60 * 60 * 1000, // 1 hari dalam milidetik
    });
    

  } catch (error) {
    console.error(error);
    return h.response({ errors:{
      server:[
        'Internal server error'
      ]
    }}).code(500);
  }
};

export default login;