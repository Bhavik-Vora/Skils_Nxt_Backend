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

//General Routes
router.post("/register",singleUpload, register); //register a new user
router.post("/login", login); //login a  user
router.get("/logout", logout); //logout a  user

//User Routes
router.use(isAuthenticated);
router.route("/me").get(getMyProfile).delete(deleteMyProfile)
router.put("/changepassword", changePassword);
router.put("/updateprofile", updateProfile);
router.put("/updateprofilepicture", singleUpload, updateProfilePicture);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:token", resetPassword);
router.post("/addtoplaylist", addToPlaylist);
router.delete("/removefromplaylist", removeFromPlaylist);



export default router;
