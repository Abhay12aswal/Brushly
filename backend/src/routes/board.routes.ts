import express from "express";
import { JWTverify } from "../middleware/auth.js";
import {
  addPaintingToBoard,
  createBoard,
  deleteBoard,
  getBoardById,
  getUserBoards,
  removePaintingFromBoard,
} from "../controller/board.controller.js";

const router = express.Router();

router.route("/create").post(JWTverify, createBoard);
router.route("/").get(JWTverify, getUserBoards);
router.route("/:boardId").get(JWTverify, getBoardById);
router.route("/add-painting").put(JWTverify, addPaintingToBoard);
router.route("/remove-painting").put(JWTverify, removePaintingFromBoard);
router.route("/:boardId").delete(JWTverify, deleteBoard);

export default router;
