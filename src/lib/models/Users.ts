import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  clerkId: String,
  wishlist: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
