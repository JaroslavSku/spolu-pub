const mongoose = require("mongoose");

const message = new mongoose.Schema(
  {
    text: {
      type: String,
      required: false,
    },
    senderEmail: {
      type: String,
      required: false,
    },
    receiverEmail: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", message);
