import {User} from "../models/User.js"
import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken"
import sendMail from "../middleware/sendMail.js"
import trycatch from "../middleware/TryCatch.js"



// export const register = async (req , res)=>{

// try {
    
// const {email , name , password  }  = req.body

// let user = await   User.findOne({email});

// // if user exists // 
// if(user) return res.status(400).json({
//     message : "User Already Exist" , 

// });

// const Haspassword = await bcrypt.hash(password , 10)

// user = {

//     name ,
//     email , 
//     password : Haspassword 
// }

// const otp  = Math.floor(Math.random() * 1000000)

// const ActivationToken = jwt.sign({
//     user , otp ,
// } , process.env.Activation_Secret , {
//     expiresIn : "5m",
// })


// const data = {
//     name  , otp , 
// } 

// await sendMail(
// email , 
// "E Learner" ,
// data

// )

// res.status(200).json({
//     message :"Otp send to your mail ",
//     ActivationToken
// })

//     res.send("REGISTER API ") ; 
// } catch (error) {
//     res.status(500).json({
//         message : error.message
//     }) 
// }
// }

export const register = async (req, res) => {
    try {
      const { email, name, password } = req.body;
  
      let user = await User.findOne({ email }); // Await here
  
      // if user exists
      if (user) return res.status(400).json({ message: "User Already Exist" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      const otp = Math.floor(Math.random() * 1000000);
  
      const activationToken = jwt.sign(
        { user, otp },
        process.env.Activation_Secret,
        { expiresIn: "5m" }
      );
  
      const data = {
        name,
        otp,
      };
  
      await sendMail(email, "E Learner", data);
  
      res.status(200).json({
        message: "Otp sent to your mail",
        activationToken,
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };



// export const verify = trycatch( async(req, res)=>{

// const {otp , activationToken} = req.body ;

// const verify = jwt.verify(activationToken, process.env.Activation_Secret)

// if(!verify) return  res.status(400).json({
//     message : "Otp expired",
// })

// if(verify.otp !== otp) return res.status(400).json({
//     message : "Wrong Otp",

// })


// await User.create({
//     name : verify.user.name ,
//     email : verify.user.email ,
//     password : verify.user.pasword , 
// })

// res.json({
// message : "User registered"

// })

// })


export const verify = trycatch(async (req, res) => {
    const { otp, activationToken } = req.body;
  
    let verify;
    try {
      verify = jwt.verify(activationToken, process.env.Activation_Secret);
    } catch (error) {
      return res.status(400).json({
        message: "Otp expired",
      });
    }
  
    if (verify.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Wrong Otp",
      });
    }
  
    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.password,
    });
  
    res.json({
      message: "User registered",
    });
  });


export const loginUser = trycatch( async(req , res)=>{

const {email , password} = req.body ;

const user =  await User.findOne({email})

if(!user) return res.status(400).json({
    message : "No User with this email" 
});

const matchpassword = await bcrypt.compare(password , user.password);

if(!matchpassword) return res.status(400).json({
    message : "Wrong Password" , 
});

const token =  jwt.sign({_id : user._id} , process.env.Jwt_Sec, {
    expiresIn : "15d" ,
})

res.status(200).json({
    message : `WELCOME BACK ${user.name}` ,
    token , 
    user 
})




})




export const myProfile = trycatch(async(req , res)=>{


    const user = await User.findById(req.user._id);

    res.json({user});
    

})