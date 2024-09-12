import express from "express";
import {
  addToPlaylist,
  changePassword,
  changeRole,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUser,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateProfilePicture,
} from "../controllers/userController.js";
import { isAuthenticated, isAuthenticatedAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// General Routes
router.post("/register", singleUpload, register); // Register a new user
router.post("/login", login); // Login a user

// User Routes
router.use(isAuthenticated); // All routes below require authentication

router.get("/logout", logout); // Logout a user

router.route("/me")
  .get(getMyProfile) // Get user profile
  .delete(deleteMyProfile); // Delete user profile

router.put("/changepassword", changePassword); // Change user password
router.put("/updateprofile", updateProfile); // Update user profile
router.put("/updateprofilepicture", singleUpload, updateProfilePicture); // Update profile picture

router.post("/forgetpassword", forgetPassword); // Request password reset
router.put("/resetpassword/:token", resetPassword); // Reset password with token

router.post("/addtoplaylist", addToPlaylist); // Add to playlist
router.delete("/removefromplaylist", removeFromPlaylist); // Remove from playlist

export default router;
