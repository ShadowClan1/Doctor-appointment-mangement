const mongoDBConnect = require("./db/db");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { User, Appointment } = require("./model/Model");

const cors = require("cors");
var bodyParser = require("body-parser");

const PORT = 5000;
const { sequelize } = require("./db/db");
const cron = require("node-cron");
const { Op } = require("sequelize");
const client = require("./common/tawilio");
const sendMessage = require("./common/tawilio");
const sendMail = require("./common/nodemailer");
//imports  end here //
app.use(bodyParser.json()); 
app.use(cors());

//signup Login
app.use("/", require("./routes/User"));
app.use("/", require("./routes/doctor"));
app.use("/", require("./routes/admin"));

// db connect

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

cron.schedule("31 * * * *", () => {
  const date = new Date();
  console.log(
    `Task is running  ${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}: ${date.getMinutes() + 1}`
  );

  Appointment.findAll({
    where: {
      [Op.and]: [
        {
          date: `${date.getFullYear()}-${
            (date.getMonth() + 1).toString().length == 1
              ? "0" + (date.getMonth() + 1).toString()
              : (date.getMonth() + 1).toString()
          }-${date.getDate()}`,
        },
        {
          visitTime: { [Op.like]: `${(date.getHours() + 2).toString()}%` },
        },
        {
          status: "Approved",
        },
      ],
    },
  })
    .then((data) => {
      data.forEach((e) => {
        User.findOne()
          .then((data1) => {
            console.log(data1.mNumber);
            sendMessage(
              data1.email,
              `Best wishes , you have an appointment Today on ${e.date} ( ${e.visitTime} ) `
            );
            sendMail(
              data1.email,
              "Appointment scheduled",
              `Best wishes , you have an appointment Today on ${e.date} ( ${e.visitTime} ) `,
              "",
              "Reminder message"
            );
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// //update

// app.put('/update', auth, async (req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;

//     let user = await User.findOne({ email: email });
//     if (!user) {

//         return res.status(410).json({ status: false, error: "User dont exists " });

//     }
//     else if (req.userID !== user.id) { return res.status(410).json({ status: false, error: "Auth failed" }) }
//     else {

//         const passMatch = await bcrypt.compare(password, user.password);
//         if (passMatch) {

//             let newEmail = req.body.newEmail;

//             let pass = req.body.newPassword;
//             const salt = await bcrypt.genSalt(10);
//             let newPassword = await bcrypt.hash(pass, salt);

//             //Enter new password
//             await User.updateOne({ _id: user.id }, { email: newEmail, password: newPassword }).then(() => {
//                 return res.status(200).json({ status: true, message: "Updated succesfully" })
//             }).catch(() => {
//                 return res.status(200).json({ status: false, message: "failed " })
//             })

//         }
//         else {
//             return res.status(410).json({ status: false, error: "Wrong password" });

//         }

//     }

// })

// //delete
// app.delete('/delete', async (req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;

//     let user = await User.findOne({ email: email });

//     if (!user) {

//         return res.status(410).json({ status: false, error: "User dont exists " });

//     }
//     else if (req.userID !== user.id) { return res.status(410).json({ status: false, error: "Auth failed" }) }
//     else {

//         const passMatch = await bcrypt.compare(password, user.password);
//         if (passMatch) {

//             await User.deleteOne({ _id: user.id }).then(() => {
//                 res.status(200).json({ status: true, message: "deleted Succesfully" })
//             }).catch(() => res.status(411).json({ status: false, message: "deletion failed" }))
//         }
//         else return res.status(410).json({ status: false, error: "Wrong password" });

//     }

// })

app.listen(PORT, () => console.log(`App is listening at port ${PORT}`));
