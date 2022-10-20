import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userroutes  from './routes/user.js';
dotenv.config();
import cors from 'cors';
import jwt from "jsonwebtoken";
import user from './model/user.js'
import  adminRouter  from './routes/admin.js';

// import sucmsg from './msg/sucmsg..js'
const app = express();
// app.use(express.json({ limit: '50mb', extended: true }))
// app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors());
const secret=process.env.SECRET
app.get('/activate/:token', async (req, res) => {
  try {
    const newuser = jwt.verify(req.params.token, secret );
    console.log(newuser);
    //await user.update({ verified: true }, { where: { _id:newuser.id } });
    const nw=await user.findOne({email:newuser.email  });
   await nw.updateOne({ $set : {verified: true} });

  } 
  
  catch (e) {
    console.log(e);
   return res.send(e.message);
  }

  return res.redirect('/msg');
});


app.use(express.json());
const url = process.env.URL_DB
const CONNECTION_URL=process.env.CONNECTION_URL_DB
// const url = "mongodb://localhost:27017/testDB"

app.use('/admin',adminRouter);


app.get('/', (req,res) => {
  res.send('yo it works');
});
app.use('/user', userroutes)
// app.get('/msg', (req, res) => {
//   res.render('index', { message: 'You activate your account go back to the page Try to singIn!' })
// })
app.set("view engine","pug")  
app.get("/msg", (req,res) => {
  res.render('index.pug', {
      title: 'welcome come back!',
      message: 'You activate your account go back to the page Try to singIn!'
  })
});

const database = mongoose.connection

// mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);