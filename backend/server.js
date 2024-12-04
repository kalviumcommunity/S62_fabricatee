import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.status(200).json({
        message: "Welcome to the API",
    });
})
app.get('/ping', (req, res)=>{
    res.status(200).json({status:"OK", timestamp: new Date()});
})

try{
    app.listen(PORT, ()=>{
        console.log(`Server Listening`);
    })
}catch(err){
    console.log(`Error in starting server: ${err}`);
}