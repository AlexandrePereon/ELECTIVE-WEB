import './config.js';
import SQLite from 'sqlite3';

export default {
  dialect: process.env.DB_DIALECT,
  host: process.env.MYSQL_HOST,
  storage: process.env.DB_STORAGE,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  define: {
    underscored: true,
  },
  logging: false,
};
