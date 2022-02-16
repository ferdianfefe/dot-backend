const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      default: "text",
    },
    image: {
      type: Buffer,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    imageType: {
      type: String,
      required: true,
    },
    decodedImage: {
      type: String,
      select: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("decodedPostImage").get(function () {
  if (this.postImage) {
    return `data:${
      this.profileImageType
    };charset=utf-8;base64,${this.postImage.toString("base64")}`;
  }

  return null;
});

module.exports = mongoose.model("Post", UserSchema);
