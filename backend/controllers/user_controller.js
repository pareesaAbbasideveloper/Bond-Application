const User = require("../models/user_model");
const Contact = require("../models/userContacts_model");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/nodemailer.js");

const handleUserSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (!name || !email || !password) {
      return res.json({ msg: "all fields are required" });
    }
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    if (user) {
      const { _id, name } = user;
      const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      return res.json({ msg: "Succesfully Signed Up", token: token });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ msg: "Email or password is incorrect" });
    }

    const validated = await bcrypt.compare(password, user.password);

    if (validated) {
      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      return res.status(200).json({ msg: "Successfully logged in", token });
    } else {
      return res.status(401).json({ msg: "Email or password is incorrect" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

const handleAddContact = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;

  const user = await Contact.find({ userId: _id });

  if (user.length !== 0) {
    const { contactInfo } = req.body;

    const userContact = await Contact.findOneAndUpdate(
      { userId: _id },
      { $push: { contactInfo: contactInfo } },
      { new: true } // Return the updated document
    );
    return res.json({ msg: "CONGRATS! USER FOUND", data: userContact });
  } else {
    const { contactInfo } = req.body;

    const userContact = await Contact.create({
      userId: _id,
      contactInfo: contactInfo,
    });

    return res.json({ msg: "Success", data: userContact });
  }
};

const handleEditProfile = async (req, res) => {
  try {
    // Extract and verify token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    // Extract data from request
    const { dateOfBirth, profession, socialMedia, name } = req.body;
    const profilePicLocalPath = req.files?.profilePic?.[0]?.path;

    // Check if a profile picture was uploaded
    if (!profilePicLocalPath) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Attempt to upload to Cloudinary
    let profilePic;
    try {
      profilePic = await uploadOnCloudinary(profilePicLocalPath);
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary" });
    }

    // Update user profile in the database
    const user = await User.findByIdAndUpdate(
      { _id: _id },
      {
        dateOfBirth,
        profession,
        socialMedia,
        profilePic: profilePic?.url,
        name,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send updated user data in response
    res.json({ data: user });
  } catch (err) {
    console.error("Error handling edit profile:", err);

    // Handle specific errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

const handleEditContacts = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;
  console.log(req.body);
  try {
    const result = await Contact.findOneAndUpdate(
      { userId: _id, "contactInfo._id": req.body.ContactID }, // Find the user and specific contactInfo by _id
      {
        $set: {
          "contactInfo.$.category": req.body.category,
          "contactInfo.$.email": req.body.email,
          "contactInfo.$.contactNumber": req.body.contactNumber,
          "contactInfo.$.socialMedia": req.body.socialMedia,
          "contactInfo.$.recurring.recurringTime": req.body.recurring,
        },
      },
      { new: true } // Return the updated document
    );

    // Extract the specific contactInfo object by matching the ContactID
    if (result) {
      const updatedContact = result.contactInfo.find(
        (contact) => contact._id.toString() === req.body.ContactID
      );

      if (updatedContact) {
        console.log("Updated Contact Info:", updatedContact);
        return res.json({ status: "success", data: updatedContact });
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "Contact not found" });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating contact info:", error.message);
    res.status(404).json({ message: "Failed" });
  }
};

const handleViewProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  const { _id } = verify;

  const user = await User.findById({
    _id: _id,
  });

  res.json({ data: user });
};

const handleFilterContact = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { inputDate } = req.body;

    const contacts = await Contact.find({ userId: _id });
    const { contactInfo } = contacts[0];

    // One Month
    // urgent today
    const data = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 1) {
        const { date } = recurring;
        let addThirtyDays = new Date(date);
        addThirtyDays.setTime(
          addThirtyDays.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        let newDate = addThirtyDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data2 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 1) {
        const { date } = recurring;
        let addThirtyDays = new Date(date);
        addThirtyDays.setTime(
          addThirtyDays.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        let newDate = addThirtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data3 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 1) {
        const { date } = recurring;
        let addThirtyDays = new Date(date);
        addThirtyDays.setTime(
          addThirtyDays.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        let newDate = addThirtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const todayData = data.filter((item) => item != null);
    const upcomingData = data2.filter((item) => item != null);
    const overDueData = data3.filter((item) => item != null);

    // 15 Days
    // urgent today
    const data13 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 0.5) {
        const { date } = recurring;
        let addFifteenDays = new Date(date);
        addFifteenDays.setTime(
          addFifteenDays.getTime() + 15 * 24 * 60 * 60 * 1000
        );
        let newDate = addFifteenDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data14 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 0.5) {
        const { date } = recurring;
        let addFifteenDays = new Date(date);
        addFifteenDays.setTime(
          addFifteenDays.getTime() + 15 * 24 * 60 * 60 * 1000
        );
        let newDate = addFifteenDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data15 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 0.5) {
        const { date } = recurring;
        let addFifteenDays = new Date(date);
        addFifteenDays.setTime(
          addFifteenDays.getTime() + 15 * 24 * 60 * 60 * 1000
        );
        let newDate = addFifteenDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });


    // Two Month
    // Urgent Today
    const data4 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 2) {
        const { date } = recurring;
        let addSixtyDays = new Date(date);
        addSixtyDays.setTime(addSixtyDays.getTime() + 60 * 24 * 60 * 60 * 1000);

        let newDate = addSixtyDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data5 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 2) {
        const { date } = recurring;
        let addSixtyDays = new Date(date);
        addSixtyDays.setTime(addSixtyDays.getTime() + 60 * 24 * 60 * 60 * 1000);

        let newDate = addSixtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data6 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 2) {
        const { date } = recurring;
        let addSixtyDays = new Date(date);
        addSixtyDays.setTime(addSixtyDays.getTime() + 60 * 24 * 60 * 60 * 1000);

        let newDate = addSixtyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const twoMonthTodayData = data4.filter((item) => item != null);
    const twoMonthUpcomingData = data5.filter((item) => item != null);
    const twoMonthOverDueData = data6.filter((item) => item != null);

    // Three Month
    // Urgent Today
    const data7 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 3) {
        const { date } = recurring;
        let addNinetyDays = new Date(date);
        addNinetyDays.setTime(
          addNinetyDays.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        let newDate = addNinetyDays.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data8 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 3) {
        const { date } = recurring;
        let addNinetyDays = new Date(date);
        addNinetyDays.setTime(
          addNinetyDays.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        let newDate = addNinetyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data9 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 3) {
        const { date } = recurring;
        let addNinetyDays = new Date(date);
        addNinetyDays.setTime(
          addNinetyDays.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        let newDate = addNinetyDays.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const threeMonthTodayData = data7.filter((item) => item != null);
    const threeMonthUpcomingData = data8.filter((item) => item != null);
    const threeMonthOverDueData = data9.filter((item) => item != null);

    // Daily
    // Urgent Today
    const data10 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 0) {
        const { date } = recurring;
        let addOneDay = new Date(date);
        addOneDay.setTime(addOneDay.getTime() + 24 * 60 * 60 * 1000);

        let newDate = addOneDay.toISOString().split("T")[0];

        if (inputDate === newDate) {
          return contact;
        }
      }
    });

    // upcoming
    const data11 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 0) {
        const { date } = recurring;
        let addOneDay = new Date(date);
        addOneDay.setTime(addOneDay.getTime() + 24 * 60 * 60 * 1000);

        let newDate = addOneDay.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds < newDateInMilliseconds) {
          return contact;
        }
      }
    });

    // over due
    const data12 = contactInfo.map((contact) => {
      const { recurring } = contact;
      if (recurring.recurringTime === 0) {
        const { date } = recurring;
        let addOneDay = new Date(date);
        addOneDay.setTime(addOneDay.getTime() + 24 * 60 * 60 * 1000);

        let newDate = addOneDay.toISOString().split("T")[0];

        let newDateObj = new Date(newDate);
        let newDateInMilliseconds = newDateObj.getTime();

        let inputDateObj = new Date(inputDate);
        let inputDateInMilliseconds = inputDateObj.getTime();

        if (inputDateInMilliseconds > newDateInMilliseconds) {
          return contact;
        }
      }
    });

    const DailyTodayData = data10.filter((item) => item != null);
    const DailyUpcomingData = data11.filter((item) => item != null);
    const DailyOverDueData = data12.filter((item) => item != null);

    return res.json({
      OneMonth: {
        "Urgent Today": todayData,
        "Upcoming data": upcomingData,
        "Over Due": overDueData,
      },
      TwoMonth: {
        "Urgent Today": twoMonthTodayData,
        "Upcoming data": twoMonthUpcomingData,
        "Over Due": twoMonthOverDueData,
      },
      ThreeMonth: {
        "Urgent Today": threeMonthTodayData,
        "Upcoming data": threeMonthUpcomingData,
        "Over Due": threeMonthOverDueData,
      },
      Daily: {
        "Urgent Today": DailyTodayData,
        "Upcoming data": DailyUpcomingData,
        "Over Due": DailyOverDueData,
      },
    });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const user = await Contact.find({ userId: _id });
    const { contactInfo } = user[0];

    res.json(contactInfo);
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleMarkAsDone = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { id } = req.params;
    const inputDate = Date.now();

    const result = await Contact.updateOne(
      { userId: _id, "contactInfo._id": id },
      {
        $set: { "contactInfo.$.recurring.date": inputDate },
        $push: { "contactInfo.$.lastContacted": inputDate },
      }
    );

    res.json(await levelIncrease(_id)); // Await the promise to log the resolved value
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const handleExtendDate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    const { inputDate } = req.body;
    const { id } = req.params;

    const result = await Contact.updateOne(
      { userId: _id, "contactInfo._id": id },
      {
        $set: { "contactInfo.$.recurring.date": inputDate },
      }
    );

    res.json({ msg: "success" });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const sendSupportEmail = async (req, res) => {
  try {
    const message = req.body;
    sendMail("Reminder App Support Mail", message.message);
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: "failed", msg: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;
    const { inputId } = req.body;

    const user = await Contact.findOne({ userId: _id });
    if (!user) {
      return res.json({ status: "failed", msg: "User not found" });
    }

    const { contactInfo } = user;

    // Check if contact exists
    const contactExists = contactInfo.some(
      (item) => item._id.toString() === inputId
    );

    if (contactExists) {
      await Contact.updateOne(
        { userId: _id },
        { $pull: { contactInfo: { _id: inputId } } }
      );
      return res.json({ status: "success", msg: "deleted successfully" });
    } else {
      return res.json({ status: "failed", msg: "Contact not found" });
    }
  } catch (error) {
    return res.json({ status: "failed", msg: error.message });
  }
};

const changePassword = async (req, res) => {
  console.log(req.body);
  try {
    // 1. Extract the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    // 4. Extract passwords from request body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    // 5. Fetch the user from the database
    const user = await User.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // 6. Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password); // Adjust the field name as needed

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 7. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 8. Update the user's password in the database
    user.password = hashedPassword; // Adjust the field name as needed
    await user.save();

    // 9. Respond with success message
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const levelIncrease = async (_id) => {
  console.log(_id);
  try {
    const userContact = await User.findOneAndUpdate(
      { _id: _id }, // Find the user by userId
      { $inc: { unburnedLog: 1 } }, // Increment unburnedLog by 1
      { new: true } // Return the updated document
    );

    if (userContact) {
      console.log("Updated User:", userContact);
      return { success: true, user: userContact };
    } else {
      console.log("User not found.");
      return { success: false, msg: "User not found." };
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    return { success: false, msg: error.message };
  }
};

const burnedLogDone = async (req, res) => {
  try {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, msg: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = verify;

    // Perform aggregation pipeline update
    const userContact = await User.findOneAndUpdate(
      { _id: _id }, // Find user by ID
      [
        {
          $set: {
            burnedLog: {
              $cond: {
                if: {
                  $and: [
                    { $lt: ["$burnedLog", 7] },
                    { $gt: ["$unburnedLog", 0] },
                  ],
                },
                then: { $add: ["$burnedLog", 1] },
                else: {
                  $cond: {
                    if: { $eq: ["$burnedLog", 7] },
                    then: 0, // Set burnedLog to 0 when unburnedLog is 8
                    else: "$burnedLog",
                  },
                },
              },
            },
            unburnedLog: {
              $cond: {
                if: {
                  $and: [
                    { $lt: ["$burnedLog", 8] },
                    { $gt: ["$unburnedLog", 0] },
                  ],
                },
                then: { $subtract: ["$unburnedLog", 1] },
                else: "$unburnedLog",
              },
            },

            level: {
              $cond: {
                if: { $eq: ["$burnedLog", 7] },
                then: { $add: ["$level", 1] },
                else: "$level",
              },
            },
          },
        },
      ],
      { new: true } // Return the updated document
    );

    // Handle response
    if (userContact) {
      res.status(200).json({
        success: true,
        msg: "User updated successfully",
        user: userContact,
      });
    } else {
      console.log("User not found.");
      res.status(404).json({ success: false, msg: "User not found." });
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleAddContact,
  handleEditProfile,
  handleViewProfile,
  handleFilterContact,
  handleMarkAsDone,
  handleExtendDate,
  getAllContacts,
  sendSupportEmail,
  deleteContact,
  changePassword,
  handleEditContacts,
  burnedLogDone,
};
