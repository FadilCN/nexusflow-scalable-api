import express from "express";
import { connectDatabase } from "./database/connection.js";
import { connectRedis } from "./redis/connection.js";
import authRoutes from './routes/auth.routes.js'
import { connectRabbitmq } from "./rabbitmq/worker.js";
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
app.use(express.json()); 
app.use(cookieParser()); 

// Connect to MongoDB
connectDatabase();

// set up Redis
await connectRedis();

// set up Rabbitmq
await connectRabbitmq();

// Routes

app.use(express.static(path.join(__dirname, 'pages/public')));

app.use('/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})