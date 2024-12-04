import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Handling uncaught Exception when setting up backend server
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught exception`);
});

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

const server = app.listen(PORT, ()=>{
    console.log(`Server Listening`);
})

// unhandled promise rejection(explain error handling when setting up server as you code)
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection.");

    app.close(() => {
        process.exit(1); // Exit with failure code
    });
});