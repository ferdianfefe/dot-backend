const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: Buffer,
      select: false,
    },
    profileImageType: {
      type: String,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("decodedProfileImage").get(function () {
  if (this.profileImage) {
    return `data:${
      this.profileImageType
    };charset=utf-8;base64,${this.profileImage.toString("base64")}`;
  }

  return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
});

module.exports = mongoose.model("User", UserSchema);