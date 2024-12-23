import express from 'express'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import dashRouter from './routes/dashUser.route.js'
import designRouter from './routes/design.route.js'
import fabricRouter from './routes/fabric.route.js'
import orderRouter from './routes/order.route.js'

const app = express();

function middleWare(req, res, next){
    console.log(req);
    next();
}

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

app.use('/api/user', middleWare, userRouter);
app.use('/api/dashboard/user', dashRouter);
app.use('/api/design', designRouter);
app.use('/api/fabric', fabricRouter);
app.use('/api/order', orderRouter);

export default app;