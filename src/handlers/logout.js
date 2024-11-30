import db from "../config/db.js";

const logout = async(request, h)=>{
  
    const token = request.state.refreshToken; // Mengambil token dari cookie
    if (!token) {
      return h.response({ 
        status:'fail',
        message:{
          erros:{
                token:['Refresh token missing']
            } 
        },data:null   
        }).code(401);
    }

    //Mencari data user berdasarkan refresh token
    const [rows] = await db.query('SELECT * FROM users WHERE refresh_token = ?', [token]);
    if (rows.length === 0) {
      return h.response({status:'fail',
      message:{
        erros:{
          token:['Invalid refresh token']
        }
      },data:null  
    }).code(403);
    }

    const user = rows[0];

    // Update refresh_token di database
    await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [null, user.id]);

    // Hapus cookie di client
    h.unstate('refreshToken');

    return h.response({
    status:'success',
    message: 'Logout successful',
    data:{
      token:null
    }
  }).code(200);

    
}

export default logout