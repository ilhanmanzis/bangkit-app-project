import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const refreshToken = async (request, h) => {
  try {
    //const token = request.payload.refreshToken; // Mengambil token dari payload
    const token = request.state.refreshToken; // Mengambil token dari cookie
    if (!token) {
      return h.response({ erros:{
        token:['Refresh token missing']
      }  }).code(401);
    }

    // Mencari data user berdasarkan refresh token
    const [rows] = await db.query('SELECT * FROM users WHERE refresh_token = ?', [token]);
    if (rows.length === 0) {
      return h.response({ erros:{
        token:['Invalid refresh token']
      }  }).code(403);
    }

    const user = rows[0];

    // Memverifikasi refresh token
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return h.response({ erros:{
        token:['Invalid or expired refresh token']
      }  }).code(403);
    }

    // Membuat access token baru
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.EXPIRED_TOKEN }
    );

    return h.response({
      message: 'Access token generated successfully',
      data: {
        accessToken,
        //refreshToken: token,
      },
    }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ errors:{
      server:[
        'Internal server error'
      ]
    }}).code(500);
  }
};

export default refreshToken;
