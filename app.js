const express = require("express");
const app = express();

// .env package
require("dotenv").config();

// built-in middleware parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }));

// mailchimp node package
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

// To serve static files such as images, CSS, and JavaScript
app.use(express.static("public"));

// sending sign-up page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});

// after submit button hitted
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.mail;
  console.log(firstName, lastName, email);

  // mailchimp audience id(list)
  const listId = "dde6d39e72";

  // user data obj
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server running in port 3000");
});
