import login  from './handlers/login.js';
import register  from './handlers/register.js';
import validateToken from './middleware/validateToken.js';
import {validateRegister, registerSchema}  from './middleware/validateRegister.js';
import { loginSchema, validateLogin } from './middleware/validateLogin.js';
import getUser from './handlers/getUser.js';
import { updateProfile } from './handlers/updateProfile.js';
import { updatePassword } from './handlers/updatePassword.js';
import { profileSchema, validateProfile } from './middleware/validateProfile.js';
import { passwordSchema, validateUpdatePassword } from './middleware/validateUpdatePassword.js';
import logout from './handlers/logout.js';
import scan from './handlers/scan.js';


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
    options:{
      pre:[{method: validateLogin(loginSchema)}]
    },
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
        { method: validateUpdatePassword(passwordSchema) },
      ],
    },
    handler: updatePassword, // Menggabungkan validasi untuk update password
  },
  {
    method:'GET',
    path:'/profile',
    options: {
      pre: [{ method: validateToken }],
    },
    handler:getUser
  },
  {
    method:'GET',
    path:'/logout',
    options:{
      pre:[{method: validateToken}]
    },
    handler:logout
  },
  {
    method:'POST',
    path:'/scan',
    handler:scan,
    options:{
      pre:[{method: validateToken}],
      payload: {
          allow: 'multipart/form-data',
          multipart: true,
          output: 'file', // Output sebagai file
          parse: true, // Parsing otomatis
          maxBytes: 5 * 1024 * 1024, // Maksimal ukuran file (5MB)

      },
    }
  }
];

export default routes;