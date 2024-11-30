import db from "../config/db.js";

const logout = async(request, h)=>{
  return h.response({
    status:'success',
    message: 'Logout successful',
    data:{
      token:null
    }
  }).code(200);
    
}

export default logout