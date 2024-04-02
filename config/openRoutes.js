// openRoutes.js

const openRoutes = [
  { path: '/', method: 'OPTIONS' },
  { path: '/restaurant/', method: 'GET' },
  { path: '/order/api-docs', method: 'GET' },
  { path: '/auth/api-docs', method: 'GET' },
  { path: '/auth/register', method: 'POST' },
  { path: '/auth/login', method: 'POST' },
  { path: '/auth/verify', method: 'GET' },
  { path: '/auth/refresh', method: 'POST' },
];

export default openRoutes;
