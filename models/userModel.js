import sequelize from 'sequelize';
import database from '../db/index.js';

const User = database.define('user', {
  firstName: {
    type: sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: sequelize.STRING,
    allowNull: false,
  },
  role: {
    type: sequelize.STRING,
    allowNull: false,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin', 'superadmin']],
    },
  },
  sponsorId: {
    type: sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  lastLogin: {
    type: sequelize.DATE,
    allowNull: true,
  },
});

export default User;
