import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const __filename = fileURLToPath(import.meta.filename);
        const __dirname = path.dirname(__filename);
        cb(null, path.join(__dirname, "../uploads"))
    }, 
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1e9);
        cb(null, file.filename+'-'+uniqueSuffix+'.png');
    }
})

export const upload = multer({storage: storage})