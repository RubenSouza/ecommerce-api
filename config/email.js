require("dotenv").config();
module.exports = {
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
};
