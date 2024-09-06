import express from "express";
import {
  contact,
  courseRequest,
  getDashboardStats,
} from "../controllers/otherController.js";
import { isAuthenticated, isAuthenticatedAdmin } from "../middlewares/auth.js";
const router = express.Router();

router.post("/contact", contact);
router.post("/courserequest", courseRequest);
router.get("/admin/stats",isAuthenticated,isAuthenticatedAdmin,getDashboardStats);

export default router;
