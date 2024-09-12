import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/UserModel.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler('Restricted Route: Please Log In to Proceed', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid or Expired Token', 401));
  }
};
  
export const isAuthenticatedAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler("U are not authorized to perform this action", 403)
    );

  next();
};

export const isSubscriber = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.subscription.status !== "active")
    return next(
      new ErrorHandler(
        "Access Denied: Only Subscribers and Premium Members Can View This Page.",
        403
      )
    );

  next();
};
