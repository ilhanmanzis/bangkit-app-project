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

    return h.response({ 
      status:'success',
      message: 'Login berhasil',
      data:{
        id:user.id,
        nama:user.nama,
        token,
      } 
    });
    

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