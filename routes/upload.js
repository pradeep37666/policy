import express from 'express'
import { handleUploadfile } from '../controllers/upload.js'
import { upload } from '../utilities/multer.js'
const router = express.Router()

router.post("/upload",upload.single('file'),handleUploadfile)

export default router