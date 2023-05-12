const app = require("express").Router();

const auth = require("../middle ware/auth");

const controller = require("../controller/controller");

app.post("/signup", controller.userSignup);

app.post("/login", controller.userLogin);

app.post("/make-appointment", auth, controller.makeAppointment);

app.post("/check-avail", controller.checkAvail);

app.get("/doctors-types", controller.getDocTypes);

app.get("/get-doc-from-type", auth, controller.getDocFromType);

app.get("/get-appointments", auth, controller.getAppointments);

app.post(
  "/cancel-appointment",
  auth,
  controller.cancelAppointmentUser
);

app.get("/get-notification", controller.getNotification);
app.patch("/set-notification", controller.setNotification);

app.get("/verify-user/:token", controller.verifyUser);

app.post("/forgot-password", controller.forgotPassword);

app.post("/reset-password", controller.resetPassword);
app.get("/is-mobileNumber-verified", controller.isMobileVerified);
app.post('/generate-otp', controller.generateOTP)
app.post('/verify-otp', controller.verifyOTP)

app.get('/user',controller.getUserInfo)

module.exports = app;
