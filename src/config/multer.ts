import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path'

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err, file.originalname);
                return cb(null, res.toString('hex') + extname(file.originalname));
            })
        }
    }),
    limits: { fieldSize: 60 * 1024 * 1024 }
}