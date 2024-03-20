import User from './userModel.js';

// Add restrictions to the User model
// User.belongsToMany(User, {
//   as: 'partners',
//   foreignKey: 'partnerId',
//   through: 'partnerships',
// });

export { User };
