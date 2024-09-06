import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/UserModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { cookietoken } = req.cookies;
  if (!cookietoken)
    return next(
      new ErrorHandler("Restricted Route: Please Log In to Proceed", 401)
    );
  const decoded = jwt.verify(cookietoken, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);
  next();
});

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
