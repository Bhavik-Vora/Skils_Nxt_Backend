import express from "express";

import { isAuthenticated, isSubscriber } from "../middlewares/auth.js";
import { buySubscription, removeSubscription } from "../controllers/SubscriptionController.js";

const router  = express.Router();


// router.get("/subscribe",isAuthenticated,buySubscription)
// router.route("/subscribe",isAuthenticated).get(buySubscription)
router.route("/subscribe").post(isAuthenticated,buySubscription );
router.route("/unsubscribe").post(isAuthenticated,isSubscriber,removeSubscription );

export default router;