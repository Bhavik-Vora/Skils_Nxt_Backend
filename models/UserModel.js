import mongoose, { Mongoose } from "mongoose";
import validator from "validator";
import bcryptjs from "bcrypt";
import crypto from "crypto";
const Userschema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    require: [true, "Please Enter Your Email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    require: [true, "Please Enter Your Password"],
    minLength: [6, "Password must be atleast 6 Characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  subscription: {
    id: {
      type: String,
    },
    status: {
      type: String,
      enum: ['inactive', 'active'],
      default: 'inactive'
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    }
  },
  avatar: {
    public_id: {
      require: true,
      type: String,
    },
    url: {
      require: true,
      type: String,
    },
  },
  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
 
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

Userschema.pre("save", async function (next) {
  if (this.isModified("password") && this.password.length < 6) {
    return next(new Error("Password must be at least 6 characters long"));
  }

  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

Userschema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(16).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
export const User = mongoose.model("User", Userschema);
