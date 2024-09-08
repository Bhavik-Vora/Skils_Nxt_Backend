import jwt from "jsonwebtoken";

// Utility function to determine if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

export const sendToken = (res, user, message, statusCode = 200) => {
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  const options = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // httpOnly: true,
    // secure: isProduction, // Set secure to true only in production
    // sameSite: isProduction ? 'None' : 'Lax', // Set SameSite attribute based on environment
  };

  res.status(statusCode).cookie("cookietoken", token, options).json({
    success: true,
    message,
    user,
  });
};
