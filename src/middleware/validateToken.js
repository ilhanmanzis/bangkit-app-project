import jwt from 'jsonwebtoken';

const validateToken = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ 
      status:'fail',
      message:{
        errors:{
          token:[
            'Authorization header missing'
          ]
        }
      },
      data:null
    }).code(401).takeover();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    request.user = decoded; // Menyimpan informasi user di objek request

    return h.continue;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return h.response({
        status:'fail',
        message:{
          errors:{
            token:[
              'Token has expired'
            ]
          }  
        } 
      }).code(401).takeover();
    }
    return h.response({ 
      status:'fail',
      message:{
        errors:{
          token:[
            'Invalid token'
          ]
        }
      },
      data:null
    }).code(403).takeover();
  }
};

export default validateToken;

