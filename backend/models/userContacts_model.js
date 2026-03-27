const mongoose = require("mongoose");

const userContactsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contactInfo: [
      {
        category: {
          type: String,
          enum: ["Friend", "Family", "Network"],
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
        },
        profilePic: {
          type: String,
        },
        contactNumber: {
          type: Number,
        },
        dateOfBirth: {
          type: Date,
        },
        socialMedia: {
          type: [String], // Array of strings to allow flexible number of links
        },
        specificDate: {
          date: {
            type: Date,
          },
          status: {
            type: Boolean,
            default: false,
          },
        },
        recurring: {
          date: {
            type: Date,
            default: Date.now(),
          },
          recurringTime: {
            type: Number,
            required: true,
          },
        },
        lastContacted: [Date],
      },
    ],
  },
  { timestamps: true }
);

const UserContacts = mongoose.model("UserContacts", userContactsSchema);

module.exports = UserContacts;
