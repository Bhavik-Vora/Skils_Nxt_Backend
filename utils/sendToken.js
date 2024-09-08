import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none", // Adjust according to your requirements
    httpOnly: true,
    secure: true,
  };
 
export const sendToken = (res, user,message,statusCode=200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res.status(statusCode).cookie("cookietoken", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};
