import express from "express";
import {
  contact,
  courseRequest
} from "../controllers/otherController.js";
import { isAuthenticated, isSubscriber } from "../middlewares/auth.js";
import { buySubscription, removeSubscription } from "../controllers/SubscriptionController.js";
import { getAllCourses } from "../controllers/courseController.js";
const router = express.Router();

router.post("/contact", contact); //contact us form from user side
router.post("/courserequest", courseRequest); //course request form from user side
router.route("/subscribe").post(isAuthenticated,buySubscription ); 
//subscibed user for subscription of courses
router.route("/unsubscribe").post(isAuthenticated,isSubscriber,removeSubscription );
router.route("/course").get(getAllCourses);
//unsubscibed user for subscription of courses

export default router;
