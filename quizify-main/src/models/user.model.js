import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email"],
  },
  password: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  accountType: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  provider: {
    type: String,
    enum: ["credentials", "github"],
    default: "credentials",
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;