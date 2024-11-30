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
      return h.response({ 
        status:'fail',
        message:{
          errors: {
            email :['Email tidak terdaftar']
          }
        },
        data:null
      }).code(404);
    }

    const user = rows[0];

    //validasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return h.response({ 
        status:'fail',
        message:{
          errors: {
            password:['Password Salah']
          }
        },
        data:null
      }).code(401);
    }


    //membuat token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET);

    //  //membuat token JWT
    // const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_TOKEN });

    // const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.EXPIRED_REFRESH_TOKEN });

    // // Update refresh_token di database
    // await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);


    return h.response({ 
      status:'success',
      message: 'Login berhasil',
      data:{
        token,
      } 
    });
    // .state('refreshToken', token, {
    //     //isSecure: true, // Gunakan true untuk HTTPS
    //     httpOnly: true, // Mencegah akses dari JavaScript
    //     path: '/', // Berlaku untuk seluruh domain
    //     ttl: 24 * 60 * 60 * 1000, // 1 hari dalam milidetik
    // });
    

  } catch (error) {
    console.error(error);
    return h.response({
      status:'fail',
      message:'Internal Server Error',
      data:null
    }).code(500);
  }
};

export default login;