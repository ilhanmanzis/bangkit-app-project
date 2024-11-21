import { login } from './handlers/login.js';
import { register } from './handlers/register.js';
import validateToken from './middleware/validateToken.js';
import { validateRegister, registerSchema } from './middleware/validateRegister.js';
import { updateProfile } from './handlers/updateProfile.js';
import { updatePassword } from './handlers/updatePassword.js';
import { updateProfileSchema, updatePasswordSchema } from './validations/profileValidation.js';
import { profileSchema, validateProfile } from './middleware/validateProfile.js';

const routes = [
  {
    method: 'POST',
    path: '/register',
    options: {
        pre: [{ method: validateRegister(registerSchema) }],
    },
    handler: register, // Route untuk register
  },
  {
    method: 'POST',
    path: '/login',
    handler: login, // Route untuk login
  },
  {
    method: 'GET',
    path: '/test',
    options: {
      pre: [{ method: validateToken }],
    },
    handler: (request, h) => {
      return h.response({ message: `Hello, ${request.user.email}` });
    },
  },
  {
    method: 'PUT',
    path: '/profile',
    options: {
      pre: [
        { method: validateToken },
        { method: validateProfile(profileSchema) },
      ],
    },
    handler: updateProfile, // Menggabungkan validasi untuk update profile
  },
  {
    method: 'PUT',
    path: '/password',
    options: {
      pre: [
        { method: validateToken },
        { method: validateRegister(updatePasswordSchema) },
      ],
    },
    handler: updatePassword, // Menggabungkan validasi untuk update password
  },
];

export default routes;
