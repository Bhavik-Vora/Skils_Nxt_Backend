// import express from "express";
// import {
//   addLectures,
//   createCourse,
//   deleteCourse,
//   deleteLecture,
//   getAllCourses,
//   getCourseLectures,
// } from "../controllers/courseController.js";

// import {
//   isAuthenticated,
//   isAuthenticatedAdmin,
//   isSubscriber,
// } from "../middlewares/auth.js";
// import singleUpload from "../middlewares/multer.js";
// const router = express.Router();

// //router.get("/", getAllCourses); 2nd MEthod to write

// //get all courses without lectures
// // router
// //   .route("/course/:id")
// //   .get(isAuthenticated, isSubscriber, getCourseLectures)
// //   .post(isAuthenticated, isAuthenticatedAdmin, singleUpload, addLectures)
// //   .delete(isAuthenticated, isAuthenticatedAdmin, deleteCourse);

// // //to get course lectures of specific course id - adminside
// // //to add course lectures of "" "" "" ""

// // router
// //   .route("/createcourse")
// //   .post(singleUpload, isAuthenticated, isAuthenticatedAdmin, createCourse);
// // //to use get file from form data we use multer
// // //to create course - adminside

// // router.delete("/course", isAuthenticated, isAuthenticatedAdmin, deleteLecture);
// export default router;
