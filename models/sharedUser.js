const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sharedUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    surname: {
      type: String,
      required: false,
    },
    admin: {
      type: Boolean,
      required: false,
    },
    verified: {
      type: Boolean,
      required: false,
      default: true,
    },
    titleBefore: {
      type: String,
      required: false,
    },
    titleAfter: {
      type: String,
      required: false,
    },
    level: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: Number,
      required: false,
    },
    userType: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    likesAds: {
      type: [String],
      required: false,
    },
    acceptedConditions: {
      type: Boolean,
      required: false,
    },
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: "History",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SharedUser", sharedUserSchema);
