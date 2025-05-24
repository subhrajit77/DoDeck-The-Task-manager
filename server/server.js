import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//db connect
connectDB();


//routes
app.get("/", (req, res) => {
    res.send("Hello from Taskflow API");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});