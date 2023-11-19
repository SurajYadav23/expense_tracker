// database.js

import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    
});

export default sequelize;
