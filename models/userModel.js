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
      isIn: [['user', 'restaurant', 'deliveryman', 'developer', 'marketing', 'technical']],
    },
  },
  partnerCode: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  partnerId: {
    type: sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    OnDelete: 'SET NULL',
  },
  lastLogin: {
    type: sequelize.DATE,
    allowNull: true,
  },
});

// Constraints
User.belongsTo(User, { as: 'Partner', foreignKey: 'partnerId', onDelete: 'SET NULL' });

export default User;
