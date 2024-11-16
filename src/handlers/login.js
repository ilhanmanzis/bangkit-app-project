import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const SECRET_KEY = process.env.JWT_SECRET;

// Login handler (sudah ada sebelumnya)
export const login = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return h.response({ message: 'User not found' }).code(404);
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return h.response({ message: 'Invalid password' }).code(401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    return h.response({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Internal server error' }).code(500);
  }
};