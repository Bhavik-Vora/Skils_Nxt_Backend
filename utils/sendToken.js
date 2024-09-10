import jwt from "jsonwebtoken";

export const sendToken = (res, user,message,statusCode=200) => {
  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{
    expiresIn:'7d',
  });

  const options = {
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
    secure:true,
    sameSite:"None",
  };
  res.status(statusCode).cookie("cookietoken", token, options).json({
    success: true,
    message,
    user,
  });
};