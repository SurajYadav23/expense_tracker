import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {

  try {
    const token = req.header('Authorization');
    console.log(token);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('userID >>>> ', user.userId)
    User.findByPk(user.userId).then(user => {

        req.user = user; 
        next();
    })

  } catch(err) {
    console.log(err);
    return res.status(401).json({success: false})
    
  }
 
};
