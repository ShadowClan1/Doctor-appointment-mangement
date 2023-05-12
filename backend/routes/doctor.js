const app = require("express").Router();
const auth = require("../middle ware/auth");
const controller = require("../controller/controller");

app.post("/doc-signup", controller.docSignup);

app.post("/doc-login", controller.docLogin);

app.get("/get-doc-des-from-id", controller.getDocDescriptionFromId);

app.get("/get-appointments-doc", controller.getAppointments);
app.post("/approve-appointment", controller.approveAppointment);
app.post("/cancel-appointment-doc", controller.cancelAppointmentDoc);

app.get("/get-notification-doc", controller.getNotificationDoc);
app.patch("/set-notification-doc", controller.setNotificationDoc);
//  {where : { [Op.and] :[
//  , {type : type}}] 
// }}

app.post("/find-doc-key", auth, controller.searchDoc);

app.patch("/comp-appointment", controller.appointmentCompleted);

app.get("/doc-earning-total", controller.getDocEarningTotal);

app.get("/doc-earning-month", controller.getDocEarningMonth);

app.post("/doc-forgot-password", controller.docForgotPassword);

app.post("/doc-reset-password", controller.docResetPassword);
app.get("/verify-doc/:token", controller.verifyDoc);
app.post('/generate-otp-doc', controller.generateOTPDoc)
app.post('/verify-otp-doc', controller.verifyOTPDoc)
app.get('/get-doc-info', controller.getDocInfo)

const docSignup = (module.exports = app);
