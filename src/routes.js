
import login  from './handlers/login.js';
import register  from './handlers/register.js';
import validateToken from './middleware/validateToken.js';
import {validateRegister, registerSchema}  from './middleware/validateRegister.js';
import { loginSchema, validateLogin } from './middleware/validateLogin.js';
import refreshToken from './handlers/refreshToken.js';


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
    method:'GET',
    path:'/token',
    handler:refreshToken
  },
];

export default routes;
