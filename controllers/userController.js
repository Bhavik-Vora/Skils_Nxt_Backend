import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/UserModel.js";
import { sendToken } from "../utils/sendToken.js";
import bcryptjs from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import { Course } from "../models/CourseModel.js";
import getDataUri from "../utils/dataUri.js";
import {Stats} from "../models/statsModel.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;

  if (!name || !email || !password || !file)
    return next(new ErrorHandler("All fields are required", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User Already Exists", 401));

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  sendToken(res, user, "User Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("All fields are required", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(
      new ErrorHandler(
        "Oops! Invalid Username or Password. Please Try Again.",
        401
      )
    );

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch)
    return next(
      new ErrorHandler(
        "Oops! Invalid Username or Password. Please Try Again.",
        401
      )
    );

  sendToken(res, user, `Welcome Back ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .cookie("cookietoken", "", {
      maxAge:0, // Expiry in the past (1 hour ago)
      httpOnly: true,
      secure: true, // Uncomment if using HTTPS
      sameSite: "none" // Adjust based on your needs
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    success: true,
    user,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("All fields are required", 400));

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await bcryptjs.compare(oldPassword, user.password);
  if (!isMatch) return next(new ErrorHandler("Incorrect old password", 400));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const file = req.file;

  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
  });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ErrorHandler("No User Found: Please Check Your Credentials.", 400)
    );
  const resetToken = await user.getResetToken();
  await user.save();
  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Reset your password using the link ${url}. If you didn't request it, no action is needed.`;

  await sendEmail(
    user.email,
    "Regain Access: Reset Your Password Today",
    message
  );
  res.status(200).json({
    message: `Reset Token has been sent to ${user.email}`,
    success: true,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) return next(new ErrorHandler("Token is Expired", 401));
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.status(200).json({
    message: "Password Changed Successfully",
    success: true,
  });
});

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));

  const itemExist = user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });

  if (itemExist) return next(new ErrorHandler("Item Already Exist", 409));

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });

  await user.save();

  res.status(200).json({
    message: "Add To Playlist Successfully",
    success: true,
  });
});

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.query.id);

  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));

  const courseInPlaylist = user.playlist.find(
    (item) => item.course.toString() === course._id.toString()
  );

  if (!courseInPlaylist) {
    return next(new ErrorHandler("This course is not in your playlist", 400));
  }

  const newPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) return item;
  });

  user.playlist = newPlaylist;
  await user.save();
  res.status(201).json({
    message: "Removed From Playlist Successfully",
    success: true,
  });
});

// {{Admin Routes}} //
export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(201).json({
    success: true,
    users,
  });
});

export const changeRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("!Oops,User not Found", 404));

  if (user.role === "user")user.role = "admin";
  else user.role = "user";

  await user.save();
  res.status(201).json({
    message: "Success! Your Role Has Been Updated.",
    success: true,
    role:user.role,
 });
});


export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("!Oops,User not Found", 404));

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  await User.findByIdAndDelete(user._id);
  res.status(200).json({
    message: "User Removed Successfully: Change Applied",
    success: true,
    user,
 });
});

export const deleteMyProfile  = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  await user.deleteOne();
  res.status(200).cookie("cookietoken",null,{
    maxAge:  0,
    httpOnly:true,
  }).json({
    message: "Profile Deleted Successfully: Change Applied",
    success: true,
    user,
 });
});


User.watch().on("change", async () => {
  try {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

    if (stats.length === 0) {
      // No stats found, create a new one
      const newStats = new Stats({
        users: await User.countDocuments(),
        subscription: (await User.find({ "subscription.status": "active" })).length,
        createdAt: new Date(Date.now()),
      });
      await newStats.save();
    } else {
      // Update the existing stats
      const subscription = await User.find({ "subscription.status": "active" });
      stats[0].users = await User.countDocuments();
      stats[0].subscription = subscription.length;
      stats[0].createdAt = new Date(Date.now());
      
      await stats[0].save();  // Save the updated stats
    }

  } catch (error) {
    console.error("Error updating stats:", error);
  }
});
