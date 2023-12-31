require("./models/db");

const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");

const app = express();
// Mock function for completing payment
function completePayment(paymentDetails) {
  // Simulate payment processing, you can replace this with your actual payment logic
  const paymentSuccessful = Math.random() < 0.8; // Mock success/failure with an 80% success rate
  return Promise.resolve(paymentSuccessful);
}

app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(bodyparser.json());

const viewsPath = path.join(__dirname, "/public/views");
const publicDirectoryPath = path.join(__dirname, "/public");

app.set("view engine", "hbs");
app.set("views", viewsPath);

app.use(express.static(publicDirectoryPath));

// localhost:3000/
app.get("/", (req, res) => {
  res.render("index");
});


var initialName;
var initialAge;
var initialDate;
var initialBatch;
var initialexpDate;
var emailstored;
const userCollection = require("./models/userModel");
app.post("/user", async (req, res) => {
  initialName = req.body.name;
  initialAge = req.body.age;
  initialDate = req.body.startDate;
  initialBatch = req.body.batch;
  console.log(initialName);

  const { name, email, phone, age, startDate, batch } = req.body;
  emailstored=req.body.email;
  console.log(emailstored);
  if (
    !name ||
    !email ||
    !phone ||
    !age ||
    startDate == "NaN/undefinedundefined/" ||
    batch == 0
  ) {
    res
      .status(400)
      .json({ message: "Information insufficient", message_id: "0" });
    return;
  } else {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, "0");
    var month = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var year = today.getFullYear();
    const currentDate = month + "/" + day + "/" + year; //month//day//year format
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const firstDateOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  
// Format the date in mm/dd/yyyy format
    const expDate = `${(firstDateOfNextMonth.getMonth() + 1).toString().padStart(2, '0')}/${firstDateOfNextMonth.getDate().toString().padStart(2, '0')}/${firstDateOfNextMonth.getFullYear()}`;
  

    const expDateprintf = `${firstDateOfNextMonth.getFullYear()}-${(firstDateOfNextMonth.getMonth() + 1).toString().padStart(2, '0')}-${firstDateOfNextMonth.getDate().toString().padStart(2, '0')}`;
    initialexpDate=expDateprintf;

    if (startDate < currentDate) {
      res.status(401).json({
        message: "Start date cannot be smaller than today's date",
        message_id: "da",
      });
      return;
    } else if (age < 18 || age > 65) {
      res
        .status(401)
        .json({ message: "Age must be between 18 & 65", message_id: "ag" });
      return;
    } else if (phone.length != 10) {
      res
        .status(401)
        .json({ message: "Invalid Phone number", message_id: "ph" });
      return;
    }

    userCollection
      .findOne({ email: email })
      .then((userSaved) => {
        if (userSaved) {
          const userStartDate = String(userSaved.startDate);
          const daysDiff =
            Number(new Date(currentDate).getTime()) -
            Number(new Date(userStartDate).getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff > 30) {
            userCollection
              .updateOne({ email: email }, { $set: { startDate: currentDate } })
              .then((updatedUser) => {
                res.render("payment_page", {
                  name: name,
                });
              })
              .catch((err) => {
                console.log(`Error in updation of new start date is ${err}`);
                return;
              });
          } else {
            res.render("payment_page", {
              name: name,
            });
            return;
          }
        } else {
          const userData = new userCollection({
            name: name,
            phone: phone,
            age: age,
            email: email,
            startDate: startDate,
            expDate: expDateprintf,
            batch: batch,
          });

          //Save the document to the database
          userData.save();

          res.render("payment_page", {
            name: name,
          });
        }
      })
      .catch((err) => {
        console.log("Error finding user");
      });
  }
});

const payCollection = require("./models/payModel");
const User = require("./models/userModel");

app.post("/payment", async (req, res) => {
  const { holderName, expirationDate, cardNo, cvvCode } = req.body;

  var user = new User();
  user.name = initialName;
  console.log(initialBatch);
  user.startDate = initialDate;
  user.expDate= initialexpDate;
  user.age = initialAge;
  user.batch = initialBatch;

  const paymentDoc = new payCollection({
    holderName: holderName,
    expirationDate: expirationDate,
    cardNo: cardNo,
    cvvCode: cvvCode,
    email: emailstored,
  });
  
  await paymentDoc.save();
  
  completePayment(req.body)
    .then((paymentSuccessful) => {
      if (paymentSuccessful) {
        // Payment successful, render success_page
        res.render("success_page", { user: user });
      } else {
        // Payment failed, render failure_page or another appropriate page
        res.render("failure_page", { user: user });
      }
    })
    .catch((error) => {
      // Handle any errors that may occur during the payment process
      console.error("Error during payment:", error);
      res.render("error_page"); // Render an error page
    });
  
});

app.listen(3000, () => {
  console.log("Server is Up and Running");
});
