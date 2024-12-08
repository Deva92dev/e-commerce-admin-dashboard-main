import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    // wishlist: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product",
    //     default: [],
    //   },
    // ],
    wishlist: { type: [String], default: [] },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserSchema.index({ clerkId: 1 });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
