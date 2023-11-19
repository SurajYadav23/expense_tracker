import { DataTypes } from "sequelize";
import sequelize from "../data/database.js";
import User from "./User.js";

 const forgetpassword = sequelize.define('forgotpassword', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: DataTypes.BOOLEAN,
     expiresby: DataTypes.DATE,
     userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id',
        },
      },
 });

export default forgetpassword;