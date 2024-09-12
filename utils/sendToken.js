import jwt from "jsonwebtoken";
export const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "None", // Adjust according to your requirements
  httpOnly: true,
  secure: true, 
};

export const sendToken = (res, user, message,statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: '7d' });

  return res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};