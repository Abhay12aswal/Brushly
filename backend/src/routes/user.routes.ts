import express from 'express';
import { getUserProfile, login, logOut, register, updateProfile } from '../controller/user.controller.js';
import { JWTverify } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").get(login);
router.route("/logout").get( JWTverify ,logOut)
router.route("/profile").get(JWTverify, getUserProfile);
router.route("/update").patch(JWTverify,upload.single("avatar") ,updateProfile);

export default router;