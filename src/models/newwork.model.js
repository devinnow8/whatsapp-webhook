const mongoose = require("mongoose");
const SCHEMA = mongoose.Schema;
const newWork = new SCHEMA(
  {
    phone_number: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    reply_with: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    data: {
      type: String,
      default: "",
    },
    tmp_data: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("newWork", newWork);
