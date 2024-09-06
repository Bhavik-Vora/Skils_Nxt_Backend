import jwt from "jsonwebtoken";

export const sendToken = (res, user,message,statusCode) => {
  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{
    expiresIn:'7d',
  });

  const options = {
    maxAge:  15 * 24 * 60 * 60 * 1000,
    httpOnly:true,
    secure:true,
    sameSite:"none",
  };
  res.status(statusCode).cookie("cookietoken", token, options).json({
    success: true,
    message,
    user,
  });
};
