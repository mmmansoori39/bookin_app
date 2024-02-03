import express, { Request, Response} from 'express';
import cors from 'cors';
import  "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import bodyParser from 'body-parser';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });
  

const app = express();
app.use(express.json());
app.use(bodyParser.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.get("/api/test", async (req: Request, res: Response) => {
    res.json({massage: "Hello from express endpoin!"});
});

app.listen(7000, () => {
    console.log("Server is running on localhost: 7000")
});