import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user from "../model/user.js";
import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';
import UserModal from "../model/user.js";
import CryptoJS from "crypto-js";
import Token from "../model/token.js";
const secret=process.env.SECRET
const userEmail=process.env.GMAIL_USER
const passwordEmail=process.env.GMAIL_PASS
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
const url_front = process.env.Front_Url
export const signup = async (req, res) => {
    const { email, password, userName } = req.body;
     console.log(req.body);
    try {
      const oldUser = await UserModal.findOne({ email:email });
  
      if (oldUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await UserModal.create({ email:email, password: hashedPassword ,name:userName });
   
  
      const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );
      const CLIENT_URL = 'http://' + req.headers.host;
  
      const output = `
      <h2>Please click on below link to activate your account</h2>
      <p>${CLIENT_URL}/activate/${token}</p>
      <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
      `;
  
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
             
              user: userEmail,
              pass: passwordEmail,
              clientId: "17128527024-8hg3f3s9m5lh69ejdsb9d4m9dc2jt4b8.apps.googleusercontent.com"
              
          },
      });
         // send mail with defined transport object
   
  
      transporter.sendMail({
        from: userEmail, // sender address
        to: email, // list of receivers
        subject: "Account Verification: Auth ✔", // Subject line
        generateTextFromHTML: true,
        html: output, // html body
      })
    
      res.status(201).json({ result, token });
 

    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }  
  };
  export const signin = async (req, res) => {
    const { email, password,verified } = req.body;
  
    try {
      const oldUser = await UserModal.findOne({ email });
  
      if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
  
      if (!oldUser.verified) {
          return res.status(400).json({ message: "your account is not verified check your email" });
        }
        
      if (!oldUser.controlled) {
        return res.status(400).json({ message: "your account is banned contact admin" });
      }
      
  
    
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
  
      res.status(200).json({ result: oldUser, token });
  
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };


  export const forget = async (req, res) => {
    const { email } = req.body;
     console.log(req.body);
    try {
      const oldUser = await user.findOne({ email: email });
  
      if (!oldUser) return res.status(400).json({ message: "User  doesn't exists" });


      let token = await Token.findOne({ userId: oldUser._id });

      if (!token) {
        token = await new Token({
            userId: oldUser._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }


  
      const output = `
      <h2>Please click on below link to reset your password</h2>
  
      <p>Click <a href="${url_front}/reset/${oldUser._id}/${token.token}" target="_blank">here</a> to reset your password</p>

      <p><b>NOTE: </b> The above link expires after you reset.</p>
      `;
  
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
             
              user: userEmail,
              pass: passwordEmail,
              clientId: "17128527024-8hg3f3s9m5lh69ejdsb9d4m9dc2jt4b8.apps.googleusercontent.com"
              
          },
      });
         // send mail with defined transport object
   
  
      transporter.sendMail({
        from: userEmail, // sender address
        to: email, // list of receivers
        subject: "Account Reset: Auth ✔", // Subject line
        generateTextFromHTML: true,
        html: output, // html body
      })
      res.send("password reset link sent to your email account");
 

    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }  
  };
  


  
  export const reset = async (req, res) => {
    const { password } = req.body;

try{
        const newuser = await UserModal.findById(req.params.userId);
        if (!newuser) return res.status(400).json({ message: "invalid link or expired" });

        const token = await Token.findOne({
            userId: newuser._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).json({ message: "invalid link or expired" });
        const hashedPassword = await bcrypt.hash(password, 12);
        
        newuser.password = hashedPassword
        await newuser.save();
        await token.delete();
        res.send("Password reset sucessfully, Try to sign in.");

      
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    
}



}