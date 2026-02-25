import jwt from "jsonwebtoken";
import { client } from "../redis/connection.js";

const JWTkey = process.env.JWT_KEY;

export const verifyToken = async (req, res, next) => {

    //const authHeader = req.headers['authorization'];

   // if(!authHeader) return res.status(401).json({ message: "Restricted no Header" });

    //const token = authHeader.split(' ')[1];

    const token = req.cookies.token; 
    console.log(token);

    
    try {

        const isBlacklisted = await client.get(token);
        if (isBlacklisted==="blackListed") return res.status(401).json({ message: "Restricted logged out" });

        const decoded = jwt.verify(token, JWTkey);
        req.payload = decoded;
        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Restricted" , error: err.message });
    }
}

export const verifyTokenAdmin = async (req, res, next) => {

    //const authHeader = req.headers['authorization'];

    //if(!authHeader) return res.status(401).json({ message: "Restricted no Header" });

    //const token = authHeader.split(' ')[1];

    const token = req.cookies.token;
    
    console.log(token);

    
    try {

        const isBlacklisted = await client.get(token);
        if (isBlacklisted==="blackListed") return res.status(401).json({ message: "Restricted logged out" });

        const decoded = jwt.verify(token, JWTkey);
        req.payload = decoded;

        console.log(decoded.role);

       if (!decoded.role.includes("admin"))  return res.status(403).json({ message: "Access denied: Admins only" });
        next(); 
    } catch (err) {
        return res.status(401).json({ message: "Restricted" , error: err.message });
    }
}
