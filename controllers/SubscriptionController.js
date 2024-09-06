// SubscriptionController.js
import { User } from "../models/UserModel.js";
import crypto from "crypto";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const buySubscription = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.role === "admin")
    return next(new ErrorHandler("Admin can't buy subscription", 400));

  const now = new Date();
  if (
    user.subscription.status === "active" &&
    user.subscription.endDate > now
  ) {
    return next(
      new ErrorHandler("You already have an active subscription.", 400)
    );
  }
  // Generate a unique subscription ID using crypto
  const subscriptionId = crypto.randomBytes(16).toString("hex");

  // Set subscription details
  const currentDate = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(currentDate.getMonth() + 1);

  user.subscription.id = subscriptionId;
  user.subscription.status = "active";
  user.subscription.startDate = currentDate;
  user.subscription.endDate = oneMonthFromNow;

  await user.save();

  res.status(201).json({
    success: true,
    subscriptionId: subscriptionId,
    message: "Subscription activated",
  });
});

export const removeSubscription = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the user has an active subscription
  if (user.subscription.status !== "active") {
    return next(new ErrorHandler("No active subscription to remove.", 400));
  }

  // Remove subscription details
  user.subscription.id = undefined;
  user.subscription.status = "inactive";
  user.subscription.startDate = undefined;
  user.subscription.endDate = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscription has been successfully removed.",
    status:user.subscription.status
  });
});
