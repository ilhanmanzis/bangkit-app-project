import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const validateToken = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ message: 'Authorization header missing' }).code(401).takeover();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    request.user = decoded; // Menyimpan informasi user
    return h.continue;
  } catch (err) {
    return h.response({ message: 'Invalid or expired token' }).code(401).takeover();
  }
};

export default validateToken;