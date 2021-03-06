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
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.virtual("decodedImage").get(function () {
  if (this.image) {
    return `data:${this.imageType};charset=utf-8;base64,${this.image.toString(
      "base64"
    )}`;
  }

  return null;
});

module.exports = mongoose.model("Post", PostSchema);
