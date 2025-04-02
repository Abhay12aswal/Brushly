import express from "express"
import { JWTverify } from "../middleware/auth.js";
import { addComment, deleteComment, getComment } from "../controller/comment.controller.js";

const router = express.Router();

router.route("/:paintingId/comment")
.post(JWTverify,addComment)
.get(getComment)

router.route("/:commentId").delete(JWTverify,deleteComment)

//can change the route /api/v1/painting/:paintingId/comment

export default router;
