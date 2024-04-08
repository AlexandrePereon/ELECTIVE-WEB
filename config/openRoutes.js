// openRoutes.js

const openRoutes = [
  { path: '/', method: 'OPTIONS' },
  { path: '/restaurant/', method: 'GET' },
  { path: '/order/api-docs', method: 'GET' },
  { path: '/api-auth/api-docs', method: 'GET' },
  { path: '/api-auth/register', method: 'POST' },
  { path: '/api-auth/login', method: 'POST' },
  { path: '/api-auth/verify', method: 'GET' },
  { path: '/api-auth/refresh', method: 'POST' },
];

export default openRoutes;
