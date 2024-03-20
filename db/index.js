import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import sequelizeConfig from '../config/sequelizeCli.js';

config();

export default new Sequelize(sequelizeConfig);
