export const credentials = (req, res, next) =>{
    const origin = req.headers.origin;
    if(origin==process.env.FRONTEND_URL){
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}