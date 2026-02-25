import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { client } from "../redis/connection.js";
import { sendEmail } from "../rabbitmq/worker.js";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWTkey = process.env.JWT_KEY;

export const signupController = async (req, res) => {
    const {email, password, role} = req.body;
    console.log(req.body);
    
    // hash password
    const hashedpassword = await bcrypt.hash(password,12);
    
    try{
        //create new user
        const newUser = new User({ email, password: hashedpassword,role });
        await newUser.save();
        console.log("Sent to Database");  
        sendEmail();      
        res.status(201).json({ message: 'User created successfully' });
       
    }
    catch (err) {
      
        if (err.code === 11000) {
            res.status(400).json({ message: "User already exists" });
        } else {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
        }
  }
}


export const signinController = async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    
    try{
        // check user

        // 1) check in cache

        const cacheKey = "email:" + email ; //similar to primary key

        const cachedData = await client.get(cacheKey);
        if (cachedData) {
            console.log("From Redis");
            const user = JSON.parse(cachedData); // full object
        }


        // 2) check in database
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({message: 'User not found'});
        // set data in Redis
        await client.set(cacheKey, JSON.stringify(user), {
            EX: 3600
        });

        

        // check password
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) return res.status(401).json({message: 'Incorrect Password'});

        // create token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWTkey,  
            { expiresIn: "1h" }
        );

        // create cookies
        res.cookie("token", token, {
        httpOnly: true,           // JS cannot access this cookie
        secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        maxAge: 60 * 60 * 1000    // 1 hour
         });

        console.log("token created");

        console.log(req.cookies.token);
            
        res.status(201).json({ message: 'User signed in successfully' , token: token});

       

    }
    catch(err){
          console.log(err); 
          res.status(500).send('Error signin ');

    };
  
}

export const logoutController = async (req, res) => {

    // get token
    //const authHeader = req.headers['authorization'];
    //if(!authHeader) return res.status(401).json({ message: "No header" });
    //const token = authHeader.split(' ')[1];

    const token = req.cookies.token;
    
    //blacklist in redis
    try{
      
        await client.set(token,"blackListed",{
            EX: 60*60
        });

        console.log("logged out");
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch(err){

          console.log(err); 
          res.status(500).send('Error loggin out ');

    };
  
}


export const homeController = (req, res) => {

    try{
        console.log(req.payload.email);
        res.sendFile(path.join(__dirname, '../pages/home.html'));
    }
    catch(err)
    {
         res.status(500).send('Error');
    }

  
}

export const homeAdmincontroller = (req, res) => {

    try{
        console.log(req.payload.email);
        res.sendFile(path.join(__dirname, '../pages/homeadmin.html'));
    }
    catch(err)
    {
         res.status(500).send('Error');
    }

  
}