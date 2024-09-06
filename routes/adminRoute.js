import express from "express";
import {
  isAuthenticated,
  isAuthenticatedAdmin,
  isSubscriber,
} from "../middlewares/auth.js";
import { getDashboardStats } from "../controllers/otherController.js";
import {
  changeRole,
  deleteUser,
  getAllUser,
} from "../controllers/userController.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getCourseLectures,
} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//Admin courses Routes

router
  .route("/course/:id")
  .get(isAuthenticated, isSubscriber, getCourseLectures)
  .post(isAuthenticated, isAuthenticatedAdmin, singleUpload, addLectures)
  .delete(isAuthenticated, isAuthenticatedAdmin, deleteCourse);

//to get course lectures of specific course id - adminside
//to add course lectures of specific course id 
//to delete course from specific course id 

router
  .route("/createcourse")
  .post(singleUpload, isAuthenticated, isAuthenticatedAdmin, createCourse);
//to use get file from form data we use multer
//to create course - adminside

router.delete("/course", isAuthenticated, isAuthenticatedAdmin, deleteLecture);
//to delete a specific lecture using courseID 

//Admin own Routes
router.use(isAuthenticated, isAuthenticatedAdmin);
router.get("/user-stats", getAllUser);
router.route("/change-role/:id").put(changeRole).delete(deleteUser);
router.get("/yearly-stats", getDashboardStats);

export default router;
