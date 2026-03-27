const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: "hurairashahid0@gmail.com",
    pass: "pyfosjfvqoyttatd",
  },
});

const sendMail = async (sub, msg) => {
  try {
    transporter.sendMail({
      to: "hurairashahid0@gmail.com",
      subject: sub,
      html: msg,
    });

    console.log("Email Sent");
  } catch (error) {
    console.log("sending mail error");
  }
};

module.exports = sendMail;

// sendMail(
//   "hurairashahid0@gmail.com",
//   "Remider App Support",
//   "This is my question"
// );
