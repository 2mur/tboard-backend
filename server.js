import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoroutes from './routes/mongoRoutes.js';
import {connectDB} from './config/db.js';

const app = express()
app.use(express.json());
app.use(cors());
app.use('/api/data', mongoroutes);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log('Server is running on port', process.env.PORT)
} )


