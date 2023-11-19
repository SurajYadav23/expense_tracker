import { DataTypes } from 'sequelize';
import sequelize from '../data/database.js';

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true, 
  },
  paymentid: DataTypes.STRING,
  orderid: DataTypes.STRING,
  status: DataTypes.STRING,
});

export default Order;
