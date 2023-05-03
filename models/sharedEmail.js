const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sharedEmailSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  registered: {
    type: Boolean,
    required: false,
    default: false,
  },
  resend: {
    type: Boolean,
    required: false,
    default: false,
  },
  resendCount: {
    type: Number,
    required: false,
    default: 0,
  },
  renewCode: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("SharedEmail", sharedEmailSchema);
