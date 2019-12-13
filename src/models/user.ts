import { genSaltSync, hash } from "bcrypt"
import mongoose, { Schema } from "mongoose"
import IUser from "../typings/interface/user"
import { ErrorMessage } from "./../lib/messages"

const userSchema = new Schema({
  avatar: {
    default: null,
    type: String,
  },
  bio: {
    default: null,
    type: String,
  },
  birthday: {
    default: null,
    type: Date,
  },
  email: {
    lowercase: true,
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
  fullName: {
    default: null,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    default: 1,
    type: Number,
  },
  status: {
    default: 2,
    type: Number,
  },
  username: {
    lowercase: true,
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
}, { timestamps: true })

// Manage and prevent copy information from being imported { email, username }
userSchema.post("save", function(error: any, doc: any, next: any) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new ErrorMessage("Exists Data", `${error.keyPattern.username ? "Username" : "Email"} is already`, 422))
  } else {
    next()
  }
})

userSchema.pre<IUser>("save", async function(next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    // hashing password
    this.password = await hash(this.password, genSaltSync(15))
    next()
  } catch (err) {
    next(err)
  }
})

export default mongoose.model<IUser>("User", userSchema)
