import jwt from "jsonwebtoken";
export const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "None", // Allows cross-site cookie usage
  httpOnly: true,
  secure: true, // Must be true for "sameSite: None"
};


export const sendToken = (res, user, message,statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: '7d' });

  return res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};
