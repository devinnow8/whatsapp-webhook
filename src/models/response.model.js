const mongoose = require("mongoose");
const SCHEMA = mongoose.Schema;
const responseTable = new SCHEMA(
  {
    current_user: {
      type: String,
      default: "",
    },
    bot_response: {
      type: String,
      default: "",
    },
    user_response: {
      type: String,
      default: "",
    },
    selected_category: {
      type: String,
      default: "",
    },
    response_type: {
      type: String,
      default: "",
    },
    next_response_type: {
      type: String,
      default: "",
    },
    appointmentId: {
      type: String,
      default: "",
    },
    appointmentDate: {
      type: String,
      default: "",
    },
    appointmentTime: {
      type: String,
      default: "",
    },
    applicantFullName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "",
    },
    phone_number: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    applicationId: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    service_type: {
      type: String,
      default: "",
    },
    center_id: {
      type: String,
      default: "",
    },
    selected_center: {
      type: String,
      default: "",
    },
    selected_date: {
      type: String,
      default: "",
    },
    selected_time: {
      type: String,
      default: "",
    },
    selected_day: {
      type: String,
      default: "",
    },
    id_number: {
      type: String,
      default: "",
    },
    id_type: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("responseTable", responseTable);
