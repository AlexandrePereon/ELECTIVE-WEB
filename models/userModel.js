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
  restaurant: {
    type: sequelize.STRING,
    allowNull: true,
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
  refreshToken: {
    type: sequelize.STRING,
    allowNull: true,
    field: 'refresh_token',
  },
  isBlocked: {
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_blocked',
  },
});

// Constraints
User.belongsTo(User, { as: 'partner', foreignKey: 'partnerId', onDelete: 'SET NULL' });

export default User;
