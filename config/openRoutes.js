// openRoutes.js

const openRoutes = [
  { path: '/', method: 'OPTIONS' },
  { path: '/', method: 'GET' },
  { path: '/auth/register', method: 'POST' },
  { path: '/auth/login', method: 'POST' },
  { path: '/auth/refresh', method: 'POST' },
];

export default openRoutes;
