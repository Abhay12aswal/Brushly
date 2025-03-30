import express from 'express'
import { JWTverify } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { getAllPaintings, getPaintingById, getUserPaintings, uploadPainting } from '../controller/painting.controller.js';

const router = express.Router();

router.route("/create-painting").post(JWTverify,upload.single("image"), uploadPainting)
router.route("/all-paintings").get(getAllPaintings);
router.route("/single/:id").get(JWTverify,getPaintingById)
router.route("/user-paintings").get(JWTverify, getUserPaintings)

export default router;