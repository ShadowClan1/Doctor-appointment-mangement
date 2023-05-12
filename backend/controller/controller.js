const { User, Doctor, Appointment } = require("../model/Model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = require("express").Router();
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const client = require("../common/tawilio");
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../db/db");
const auth = require("../middle ware/auth");
const nodemailer = require("nodemailer");
const sendMail = require("../common/nodemailer");
const sendMessage = require("../common/tawilio");
const otp = require("otp-generator");

const userSignup = async (req, res) => {
  let tokenGen = uuid.v4();
  let email = req.body.email;
  let id = uuid.v4();
  let password = req.body.password;
  let fName = req.body.fName;
  let age = req.body.age;
  let gender = req.body.gender;
  let accountType = req.body.accountType;
  let mNumber = req.body.mNumber;
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);

  //real code starts
  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    let user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(410).json({ status: false, code: 101 });
    } else {
      user = await User.create({
        id: id,
        email: email,
        password: password,
        fName: fName,
        age: parseInt(age),
        gender: gender,
        accountType: accountType,
        mNumber: mNumber,
        verified: "F",
        token: tokenGen,
        validTill: date,
        temp: JSON.stringify({ m: mNumber, v: "F" }),
      });

      sendMail(
        email,
        "Verification Link",
        "",
        ` 
        <p> This message is being sent to verify your email click on the button below to verify yourself</p>
        <a style="color:blue; background-color:yellow ;  padding-left: 10px ; padding-right : 10px; padding-top : 5px; padding-bottom : 5px; border-radius : 10px;" href='http://localhost:5000/verify-user/${tokenGen}'>verify</a>`,
        "error in sending mail signup"
      );

      return res.status(200).json({
        status: true,
        message:
          "user created successfully a mail has been sent to email to verify the email",
        code: 1,
      });
    }
  } catch (err) {
    console.log("Error in Signup module occured", err);
    res.status(200).json({ status: false });
  }
};

const userLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let user = await User.findOne({ where: { email: email } });

  if (!user) {
    return res
      .status(410)
      .json({ status: false, error: "User dont exists ", code: 110 });
  } else {
    if (user.verified == "F")
      return res.status(410).json({
        status: false,
        error: "User has not verified account yet ",
        code: 111,
      });

    await bcrypt.compare(password, user.password).then((result) => {
      if (result === true) {
        dotenv.config();

        const payLoadData = {
          id: user.id,
        };
        dotenv.config();
        const token = jwt.sign(payLoadData, process.env.KEY);

        return res
          .status(200)
          .json({ status: true, token: token, code: 2, id: user.id });
      } else {
        return res
          .status(410)
          .json({ status: false, error: "Wrong password", code: 102 });
      }
    });
  }
};

const makeAppointment = (req, res) => {
  const userId = req.body.userId;

  if (req.userId !== userId)
    return res
      .status(200)
      .json({ sucess: false, error: "user Verification failed" });

  let id = uuid.v4();

  const doctorId = req.body.doctorId;
  const date = req.body.date;
  const time = req.body.time;

  let appointment = Appointment.create({
    id: id,
    patientId: userId,
    doctorId: doctorId,
    date: date,
    visitTime: time,
    status: "Waiting",
    seenU: "N",
    seenD: "N",
  })
    .then((data) => {
      Doctor.findOne({
        where: {
          id: doctorId,
        },
      })
        .then((data) => {
          // twilo message to doc

          sendMessage(
            data.mNumber,
            `Best wishes doctor, you have an appointment request for ${date} ( ${time} ) . Approve it or delete it `
          );

          sendMail(
            data.email,
            `Appointment for ${date}`,
            `Best wishes doctor, you have an appointment request for ${date} ( ${time} ) . Approve it or delete it `,
            ``,
            "error in sending mail appointment"
          );

          console.log({ toDoc: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });
      User.findOne({
        where: {
          id: userId,
        },
      })
        .then((data) => {
          // twilo message to patient
          sendMessage(
            data.mNumber,
            `Best wishes , you have booked an appointment request for ${date} ( ${time} ) . we will let you know once doc approves it or delete it `
          );
          sendMail(
            data.email,
            `Appointment for ${date}`,
            `Best wishes , you have booked an appointment request for ${date} ( ${time} ) . we will let you know once doc approves it`,
            `<></>`,
            "error in sending mail appointment"
          );

          console.log({ toUser: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });

      ///

      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(200).json({ err, success: false });
    });
};

const checkAvail = (req, res) => {
  const docId = req.headers.doctor;
  const date = req.body.date;
  const time = req.body.time;
  Appointment.findAll({
    where: {
      [Op.and]: [
        { doctorId: docId },
        { date: date },
        { visitTime: time },
        { status: "Approved" },
      ],
    },
  })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const getDocTypes = (req, res) => {
  Doctor.findAll({ attributes: ["type"], distint: "type" })
    .then((data) => {
      const data2 = data.map((e) => {
        return e.type;
      });
      const data1 = Array.from(new Set(data2));
      console.log(data1);

      res.status(200).json({ data1 });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const getDocFromType = (req, res) => {
  if (req.headers.user !== req.userId)
    return res.status(401).json({ succes: false });

  Doctor.findAll({
    where: {
      type: req.headers.type,
    },
  })
    .then((data) => {
      console.log(data);
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};
const getAppointments = (req, res) => {
  Appointment.findAll({ where: { patientId: req.headers.user } })
    .then((data) => {
      res.status(200).json({ data, success: true });
    })
    .catch((err) => {
      res.status(200).json({ err, success: false });
    });
};

const cancelAppointmentUser = (req, res) => {
  if (req.headers.user !== req.userId)
    return res
      .status(401)
      .json({ succes: false, reason: "failed to authenticate" });

  let doctorId = req.body.doctorId;
  let userId = req.body.userId;
  let date = req.body.date;
  let time = req.body.time;
  Appointment.update(
    { status: "Canceled", remarks: "Canceled by user" },
    { where: { id: req.body.id, patientId: req.body.userId } }
  )
    .then((data) => {
      //

      Doctor.findOne({
        where: {
          id: doctorId,
        },
      })
        .then((data) => {
          sendMail(
            data.email,
            `Appointment for ${date}`,
            `Best wishes doctor, appointment request for ${date} ( ${time} ) has been canceled `,
            ``,
            "error in sending mail cancelation"
          );

          sendMessage(
            data.mNumber,
            `Best wishes doctor, appointment request for ${date} ( ${time} ) has been canceled `
          );
        })
        .catch((err) => {
          console.log({ err });
        });
      //only doc will get message when user cancelled the appointment

      User.findOne({
        where: {
          id: userId,
        },
      })
        .then((data) => {
          sendMail(
            data.email,
            `Appointment for ${date}`,
            `Best wishes , you have canceled an appointment request for ${date} ( ${time} ) `,
            ``,
            "error in sending mail cancelation"
          );

          sendMessage(
            data.mNumber,
            `Best wishes , you have canceled an appointment request for ${date} ( ${time} ) `
          );

          console.log({ toUser: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });

      //
      res.status(200).json({ succes: true });
    })
    .catch((err) => {
      res.status(200).json({ success: false, reason: "Module error" });
    });
};

const getNotification = (req, res) => {
  Appointment.findAll({
    where: {
      [Op.and]: [{ patientId: req.headers.user }, { seenU: "N" }],
    },
  })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};
const setNotification = (req, res) => {
  Appointment.update(
    { seenU: "Y" },
    {
      where: {
        [Op.and]: [{ patientId: req.headers.user }, { seenU: "N" }],
      },
    }
  )
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const verifyUser = (req, res) => {
  const token = req.params.token;

  User.findOne({ where: { token: token } })
    .then((data) => {
      if (data) {
        const date1 = new Date(data.validTill);
        const date2 = new Date();

        if (date1.getTime() > date2.getTime()) {
          User.update({ verified: "T", token: "" }, { where: { token: token } })
            .then((data) => {
              console.log("User Verified");
              return res.status(410).json({ status: true });
            })
            .catch((err) => {
              return res
                .status(410)
                .json({ status: false, err: "User verification failed" });
            });
        } else {
          User.destroy({
            where: {
              token: token,
            },
          })
            .then((data) => {
              return res
                .status(410)
                .json({ status: false, reason: "Token expired" });
            })
            .catch((err) => {
              return res
                .status(410)
                .json({ status: false, reason: "Token expiredd" });
            });
        }
      } else {
        return res.send("User not found");
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ success: false, err: "couldn't find the doc", token: token });
    });
};

const forgotPassword = (req, res) => {
  const tokenGen = uuid.v4();

  let email = req.body.email;
  console.log(email);
  User.findOne({ where: { email: email } })
    .then((data) => {
      if (data) {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 10);

        User.update(
          { token: tokenGen, validTill: date },
          {
            where: {
              email: email,
            },
          }
        ).then((data) => {
          sendMail(
            email,
            "Password reset Link",
            "This message is to rest password",
            `<a href='http://localhost:3000/reset-password/${tokenGen}'>  Reset  </a>`,
            "forgot password"
          );
          return res.status(200).json({ success: true });
        });
      } else
        return res
          .status(410)
          .json({ status: false, error: "user not found ", code: 110 });
    })
    .catch((err) => {
      return res
        .status(410)
        .json({ status: false, error: "user NOt found ", code: 110, err });
    });
};
const resetPassword = async (req, res) => {
  let token = req.body.token;
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  User.findOne({ where: { token: token } })
    .then((data) => {
      const date1 = new Date(data.validTill);
      const date2 = new Date();

      if (date1.getTime() > date2.getTime()) {
        User.update(
          { password: password, token: "" },
          { where: { token: token } }
        )
          .then((data) => {
            console.log("Reseted password");
            return res.status(410).json({ status: true });
          })
          .catch((err) => {
            return res
              .status(410)
              .json({ status: false, err: "couldn't update the password" });
          });
      } else {
        return res.status(410).json({ status: false, reson: "Token expired" });
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ success: false, err: "couldn't find the doc", token: token });
    });
};

const docSignup = async (req, res) => {
  let id = uuid.v4();
  let tokenGen = uuid.v4();
  let email = req.body.email;
  let password = req.body.password;
  let fName = req.body.fName;
  let age = req.body.age;
  let mNumber = req.body.mNumber;
  let gender = req.body.gender;
  let type = req.body.type;
  let location = req.body.location;
  let description = req.body.description;
  let hospital = req.body.hospital;
  const date = new Date();
  date.setMinutes(date.getMinutes() + 10);
  //real code starts
  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    let user = await Doctor.findOne({ where: { email: email } });
    if (user) {
      return res.status(410).json({ status: false, code: 101 });
    } else {
      user = await Doctor.create({
        id: id,
        email: email,
        password: password,
        fName: fName,
        age: parseInt(age),
        gender: gender,
        type: type,
        location: location,
        description: description,
        hospital: hospital,
        mNumber: mNumber,
        verified: "F",
        token: tokenGen,
        validTill: date,
        temp: JSON.stringify({ m: mNumber, v: "F" }),
      });

      sendMail(
        email,
        `Verification Link`,
        `This message is being sent to verify your email`,
        `<a href='http://localhost:5000/verify-doc/${tokenGen}'>  verify   </a>`,
        "error in doc login"
      );

      return res
        .status(200)
        .json({ success: true, message: "Doc created successfully", code: 1 });
    }
  } catch (err) {
    console.log("Error in Signup module occured", err);
    res.status(200).json({ status: false, err });
  }
};

const docLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let user = await Doctor.findOne({ where: { email: email } });

  if (!user) {
    return res
      .status(410)
      .json({ success: false, error: "User dont exists ", code: 110 });
  } else {
    if (user.verified == "F")
      return res
        .status(410)
        .json({ success: false, error: "User not verified", code: 112 });

    await bcrypt.compare(password, user.password).then((result) => {
      if (result === true) {
        dotenv.config();

        const payLoadData = {
          id: user.id,
        };
        dotenv.config();
        const token = jwt.sign(payLoadData, process.env.KEY);

        return res
          .status(200)
          .json({ success: true, token: token, code: 2, id: user.id });
      } else {
        return res
          .status(410)
          .json({ success: false, error: "Wrong password", code: 102 });
      }
    });
  }
};

const getDocDescriptionFromId = (req, res) => {
  Doctor.findOne({
    where: {
      id: req.headers.id,
    },
  })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const getAppointmentsDoc = (req, res) => {
  Appointment.findAll({
    where: {
      doctorId: req.headers.doctor,
    },
  })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};
const approveAppointment = (req, res) => {
  const app = Appointment.update(
    { status: "Approved", remarks: "Approve by the doc" },
    { where: { id: req.body.id, doctorId: req.body.doctorId } }
  )
    .then((data) => {
      let userId = req.body.userId;
      let doctorId = req.body.doctorId;
      let time = req.body.time;
      let date = req.body.date;

      //
      Doctor.findOne({
        where: {
          id: doctorId,
        },
      })
        .then((data) => {
          sendMail(
            data.email,
            `Appointment on ${date}`,
            `Best wishes doctor, appointment request for ${date} ( ${time} ) has been approved successfully`,
            ``,
            "error in doc approval"
          );

          sendMessage(
            data.mNumber,
            `Best wishes doctor, appointment request for ${date} ( ${time} ) has been approved`
          );

          console.log({ toDoc: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });
      User.findOne({
        where: {
          id: userId,
        },
      })
        .then((data) => {
          sendMail(
            data.email,
            `Appointment on ${date}`,
            `Best wishes , appointment request for ${date} ( ${time} )  has been approved.`,
            ``,
            "error in doc approval"
          );

          sendMessage(
            data.mNumber,
            `Best wishes , appointment request for ${date} ( ${time} )  has been approved.`
          );

          console.log({ toUser: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });

      //
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const cancelAppointmentDoc = async (req, res) => {
  let date = req.body.date;
  let time = req.body.time;
  Appointment.update(
    { status: "Canceled", remarks: "Canceled by doctor" },
    { where: { id: req.body.id, doctorId: req.body.doctorId } }
  )
    .then((data) => {
      res.status(200).json({ data });

      sendMail(
        data.email,
        `Appointment on ${date}`,
        `Best wishes doctor, appointment request for ${date} ( ${time} ) has been canceled `,
        ``,
        "error in doc approval"
      );

      //
      Doctor.findOne({
        where: {
          id: req.body.doctorId,
        },
      })
        .then((data) => {
          sendMessage(
            data.mNumber,
            `Best wishes doctor, appointment request for ${date} ( ${time} ) has been canceled `
          );

          console.log({ toDoc: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });
      User.findOne({
        where: {
          id: req.body.userId,
        },
      })
        .then((data) => {
          sendMessage(
            data.mNumber,
            `Best wishes , Doctor has canceled the appointment request for ${date} ( ${time} ) `
          );

          sendMail(
            data.email,
            `Appointment on ${date}`,
            `Best wishes doctor, appointment request for ${date} ( ${time} ) has been canceled `,
            ``,
            "error in doc cancelation"
          );

          console.log({ toUser: data.mNumber });
        })
        .catch((err) => {
          console.log({ err });
        });

      //
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};
const getNotificationDoc = (req, res) => {
  Appointment.findAll({
    where: {
      [Op.and]: [{ doctorId: req.headers.doctor }, { seenD: "N" }],
    },
  })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};
const setNotificationDoc = (req, res) => {
  Appointment.update(
    { seenD: "Y" },
    {
      where: {
        [Op.and]: [{ doctorId: req.headers.doctor }, { seenD: "N" }],
      },
    }
  )
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const searchDoc = (req, res) => {
  if (req.headers.user !== req.userId)
    return res.status(401).json({ succes: false });
  let search = req.body.search;
  let type = req.body.type;
  Doctor.findAll({
    where: {
      [Op.and]: [{ fName: { [Op.like]: `%${search}%` } }, { type: type }],
    },
  })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ err });
    });
};

const appointmentCompleted = (req, res) => {
  let id = req.body.id;
  let doctorId = req.body.docId;
  let earning = req.body.earning;
  Appointment.update(
    {
      status: "Completed",
      remarks: req.body.remarks,
      charged: parseInt(earning),
    },
    {
      where: {
        id: id,
        doctorId: doctorId,
        status: "Approved",
      },
    }
  )
    .then((data) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(200).json({ success: false });
    });
};
const getDocEarningTotal = (req, res) => {
  let doctorId = req.headers.docid;
  sequelize
    .query(
      `SELECT SUM(charged) AS sum FROM appointments WHERE doctorId = ?  `,
      {
        replacements: [doctorId],
        type: QueryTypes.SELECT,
      }
    )
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const getDocEarningMonth = (req, res) => {
  let doctorId = req.headers.docid;
  const date = new Date();
  sequelize
    .query(
      `SELECT SUM(charged) as sum FROM appointments WHERE doctorId = ? AND date LIKE ? `,
      {
        replacements: [
          doctorId,
          `${date.getFullYear()}-${
            (date.getMonth() + 1).toString().length == 1
              ? "0" + (date.getMonth() + 1).toString()
              : (date.getMonth() + 1).toString()
          }%`,
        ],
        type: QueryTypes.SELECT,
      }
    )
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(200).json({ err });
    });
};

const docForgotPassword = (req, res) => {
  const date = new Date();
  let tokenGen = uuid.v4();
  let email = req.body.email;
  console.log(email);
  Doctor.findOne({ where: { email: email } })
    .then((data) => {
      if (data) {
        date.setHours(date.getHours() + 1);

        Doctor.update(
          { token: tokenGen, validTill: date },

          {
            where: {
              email: email,
            },
          }
        )
          .then((data1) => {
            sendMail(
              email,
              "Password reset link",
              "This message is to rest password",
              `<a href='http://localhost:3000/reset-password-doc/${tokenGen}'>  Reset  </a>`,
              "error in doc email sending"
            );
          })
          .catch((err) => console.log(err));

        return res.status(200).json({ success: true });
      } else
        return res
          .status(410)
          .json({ status: false, error: "user not found ", code: 110 });
    })
    .catch((err) => {
      return res
        .status(410)
        .json({ status: false, error: "user NOt found ", code: 110, err });
    });
};

const docResetPassword = async (req, res) => {
  let token = req.body.token;
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  Doctor.findOne({ where: { token: token } })
    .then((data) => {
      const date1 = new Date(data.validTill);
      const date2 = new Date();

      if (date1.getTime() > date2.getTime()) {
        Doctor.update(
          { password: password, token: "" },
          { where: { token: token } }
        )
          .then((data) => {
            console.log("Reseted password");
            return res.status(410).json({ status: true });
          })
          .catch((err) => {
            return res
              .status(410)
              .json({ status: false, err: "couldn't update the password" });
          });
      } else {
        return res.status(410).json({ status: false, reson: "Token expired" });
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ success: false, err: "couldn't find the doc", token: token });
    });
};
const verifyDoc = (req, res) => {
  const token = req.params.token;

  Doctor.findOne({ where: { token: token } })
    .then((data) => {
      if (data) {
        const date1 = new Date(data.validTill);
        const date2 = new Date();

        if (date1.getTime() > date2.getTime()) {
          Doctor.update(
            { verified: "T", token: "" },
            { where: { token: token } }
          )
            .then((data) => {
              console.log("User Verified");
              return res.send("<h1>Verified successfully</h1>");
            })
            .catch((err) => {
              return res
                .status(410)
                .json({ status: false, err: "User verification failed" });
            });
        } else {
          return res
            .status(410)
            .json({ status: false, reson: "Token expired" });
        }
      } else {
        return res.send("<h1>Token not found</h1>");
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ success: false, err: "couldn't find the doc", token: token });
    });
};
const isMobileVerified = async (req, res) => {
  let userId = req.headers.user;

  User.findOne({ where: { id: userId } })
    .then((data) => {
      const data1 = JSON.parse(data.temp);
      //   const data2 = JSON.parse(data1)
      if (data1.v === "F")
        return res
          .status(400)
          .json({ success: true, status: false, data: "not verified" });
      else if (data1.v === "T")
        return res
          .status(400)
          .json({ succes: false, status: true, data: "verified" });
    })
    .catch((err) => {
      res.status(200).json({ success: false, reason: "There is an err" });
    });
};

const generateOTP = (req, res) => {
  let id = req.body.id;
  let OTPgen = otp.generate(4, {
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });
  const date = new Date();
  date.setMinutes(date.getMinutes() + 2);

  User.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      let mNumber = data.mNumber
      data = JSON.parse(data.temp);

      if (data.v === "F") {
        User.update(
          { temp: JSON.stringify({ otp: OTPgen, v: "F", validTill: date }) },
          {
            where: {
              id: id,
            },
          }
        ).then((data1) => {
          // sendMail(
          //   "ritiks786@gmail.com",
          //   "verify number",
          //   "This is your OTP to verify account " + OTPgen,
          //   "",
          //   "generate Otp"
          // );
          sendMessage(mNumber, "This is your OTP to verify account " + OTPgen)

          res.status(200).json({
            success: true,
            messge: "OTP generated and sent succesfully",
          });
        });
      } else {
        res
          .status(200)
          .json({ success: false, err: "Mobile number is already verified" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send("There is some error");
    });
};
const verifyOTP = (req, res) => {
  let id = req.body.id;
  let OTPr = req.body.otp;

  User.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      data = JSON.parse(data.temp);
      const date1 = new Date();
      const date2 = new Date(data.validTill);
      if (data.v === "F" && date1.getTime() < date2.getTime()) {
        if (data.otp === OTPr) {
          User.update(
            { temp: JSON.stringify({ v: "T" }) },
            {
              where: {
                id: id,
              },
            }
          ).then((data1) => {
            sendMail(
              "ritiks786@gmail.com",
              "verify number",
              "Mobile number verified",
              "",
              "generate Otp"
            );

            res
              .status(200)
              .json({ success: true, message: "verified successfully" });
          });
        } else res.status(200).json({ success: false, err: "Cannot verify " });
      } else {
        if (data.v !== "T") {
          User.update(
            { temp: JSON.stringify({ v: "F" }) },
            {
              where: {
                id: id,
              },
            }
          ).then(() => {
            res.status(200).json({ success: false, err: "Otp expired" });
          });
        } else {
          res
            .status(200)
            .json({ succes: false, message: "User is already verified" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send("There is some error");
    });
};
const isMobileVerifiedDoc = async (req, res) => {
  let userId = req.headers.user;

  User.findOne({ where: { id: userId } })
    .then((data) => {
      const data1 = JSON.parse(data.temp);
      //   const data2 = JSON.parse(data1)
      if (data1.v === "F")
        return res
          .status(400)
          .json({ success: true, status: false, data: "not verified" });
      else if (data1.v === "T")
        return res
          .status(400)
          .json({ succes: false, status: true, data: "verified" });
    })
    .catch((err) => {
      res.status(200).json({ success: false, reason: "There is an err" });
    });
};

const generateOTPDoc = (req, res) => {
  let id = req.body.id;
  let OTPgen = otp.generate(4, {
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });
  const date = new Date();
  date.setMinutes(date.getMinutes() + 2);

  Doctor.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      let mNumber = data.mNumber
      data = JSON.parse(data.temp);

      if (data?.v === "F") {
        Doctor.update(
          { temp: JSON.stringify({ otp: OTPgen, v: "F", validTill: date }) },
          {
            where: {
              id: id,
            },
          }
        ).then((data1) => { 
          

// sendMessage(mNumber, "This is your OTP to verify phone number " + OTPgen)


          res.status(200).json({
            success: true,
            messge: "OTP generated and sent succesfully",
          });
        });
      } else {
        res
          .status(200)
          .json({ success: false, err: "Mobile number is already verified" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send("There is some error");
    });
};
const verifyOTPDoc = (req, res) => {
  let id = req.body.id;
  let OTPr = req.body.otp;
  

  Doctor.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      data = JSON.parse(data.temp);
      const date1 = new Date();
      const date2 = new Date(data.validTill);
      if (data.v === "F" && date1.getTime() < date2.getTime()) {
        if (data.otp === OTPr) {
          Doctor.update(
            { temp: JSON.stringify({ v: "T" }) },
            {
              where: {
                id: id,
              },
            }
          ).then((data1) => {
            

            res
              .status(200)
              .json({ success: true, message: "verified successfully" });
          });
        } else res.status(200).json({ success: false, err: "Cannot verify " });
      } else {
        if (data.v !== "T") {
          Doctor.update(
            { temp: JSON.stringify({ v: "F" }) },
            {
              where: {
                id: id,
              },
            }
          ).then(() => {
            res.status(200).json({ success: false, err: "Otp expired" });
          });
        } else {
          res
            .status(200)
            .json({ succes: false, message: "User is already verified" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send("There is some error");
    });
};
const getUserInfo = (req, res) => {
  let id = req.headers.user;

  User.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};
const getDocInfo = (req, res) => {
  let id = req.headers.doc;
  console.log(id)

  Doctor.findOne({
    where: {
      id: id,
    },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(200).json(err);
    });
};

module.exports = {
  userSignup,
  userLogin,
  makeAppointment,
  checkAvail,
  getDocTypes,
  getDocFromType,
  getAppointments,
  cancelAppointmentUser,
  getNotification,
  setNotification,
  verifyUser,
  forgotPassword,
  resetPassword,
  docSignup,
  docLogin,
  getDocDescriptionFromId,
  getAppointmentsDoc,
  approveAppointment,
  cancelAppointmentDoc,
  getNotificationDoc,
  setNotificationDoc,
  searchDoc,
  appointmentCompleted,
  getDocEarningTotal,
  getDocEarningMonth,
  docForgotPassword,
  docResetPassword,
  verifyDoc,
  isMobileVerified,
  generateOTP,
  verifyOTP,
  isMobileVerifiedDoc,
  generateOTPDoc,
  verifyOTPDoc,
  getUserInfo,
getDocInfo,
};
