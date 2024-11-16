
import { login } from './handlers/login.js';
import { register } from './handlers/register.js';
import validateToken from './middleware/validateToken.js';
import { validateRegister, registerSchema } from './middleware/validateRegister.js';


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
];

export default routes;
