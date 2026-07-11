import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  getUnreadCounts,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/unread", protectRoute, getUnreadCounts);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);


export default router;