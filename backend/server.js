import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.status(200).send("Response");
})
app.get('/ping', (req, res)=>{
    res.status(200).json({status:"OK", timestamp: new Date()});
})

app.listen(PORT, ()=>{
    console.log(`Server Listening`);
})