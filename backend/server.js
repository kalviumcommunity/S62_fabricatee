import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
    origin: `http://localhost:${PORT}` //frontend url
}));

app.get('/', (req, res)=>{
    res.send("Response");
})
app.get('/ping', (req, res)=>{
    res.send("Response");
})

app.listen(PORT, ()=>{
    console.log(`Server Listening on http://localhost:${PORT}`);
})