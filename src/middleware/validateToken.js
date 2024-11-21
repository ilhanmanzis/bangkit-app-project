import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const validateToken = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ errors:{
      token:[
        'Authorization header missing'
      ]
    }  }).code(401).takeover();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    request.user = decoded; // Menyimpan informasi user di objek request
    return h.continue;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return h.response({ errors:{
        token:[
          'Token has expired'
        ]
      }  }).code(401).takeover();
    }
    return h.response({ errors:{
      token:[
        'Invalid token'
      ]
    }  }).code(403).takeover();
  }
};

export default validateToken;

