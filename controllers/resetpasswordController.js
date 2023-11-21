import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Forgotpassword from '../models/Forgotpassword.js';

export const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        console.log(user);

        if (user) {
            const id = uuidv4();
            await user.createForgotpassword({ id, active: true });
 
         
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'surajy9898@gmail.com',
                    pass: 'psqa ewdu jfok xmgk',
                },
            });

            const mailOptions = {
                from: 'yadav9898s@gmail.com', 
                to: email, 
                subject: 'Reset Password', 
                html: `<a href="http://3.110.123.247:5000/password/resetpassword/${id}">Reset password</a>`,
            };

          
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw new Error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).json({ message: 'Link to reset password sent to your mail', success: true });
                }
            });
        } else {
            throw new Error('User does not exist');
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err.message, success: false });
    }
};

export const resetpassword = (req, res) => {
    const id = req.params.id;
    Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            );
            res.end();
        }
    });
};

export const updatepassword = (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        Forgotpassword.findOne({ where: { id: resetpasswordid } }).then((resetpasswordrequest) => {
            User.findOne({ where: { id: resetpasswordrequest.userId } }).then((user) => {
                if (user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({ message: 'Successfully updated the new password' });
                            });
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user exists', success: false });
                }
            });
        });
    } catch (error) {
        return res.status(403).json({ error, success: false });
    }
};
