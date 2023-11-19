import User from '../models/User.js';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isstringinvalid(email) || isstringinvalid(password)) {
      return res.status(400).json({message: 'EMail idor password is missing ', success: false})
    }
    

    const user = await User.findOne({ where: { email } });
    console.log("logging the user"+ user.username);

    if (!user) {
      return res.status(400).json({ error: 'user not present' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        throw new Error('Something went wrong')
      }
      
      if (result == true) {
        return res.status(200).json({ success: true, message: "User logged in successfully", token: generateAccessToken(user.id, user.username, user.ispremiumuser) });
      }

      else {
        return res.status(404).json({success: false, message: 'User Doesnot exitst'}) 
      }
  });

   
  } catch (error) {
    res.status(500).json(error);
  }
};

export const register = async (req, res) => {
  try{
    const { username, email, password } = req.body;
    console.log(email);
    if(isstringinvalid(username) || isstringinvalid(email || isstringinvalid(password))){
        return res.status(400).json({err: "Bad parameters . Something is missing"})
    }
    const saltrounds = 10;
     bcrypt.hash(password, saltrounds, async (err, hash) => {
      console.log(err);
      const user = await User.create({ username, email, password: hash })
       if (user) {
      
        res.status(201).json({ message: 'Successfully created a new user', user: user.toJSON()}); 
    }
    })
    }catch(err) {
            res.status(500).json("err is comming from here"+err);
        }
};

export const generateAccessToken = (id, username, ispremiumuser) => {
  return jwt.sign({ userId: id, username: username, ispremiumuser }, process.env.JWT_SECRET);
}

function isstringinvalid(s) {
  if (s == undefined || s.length === 0) {
    return true;
  } else {
    return false;
  }
}

