const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "zaminsharma99@gmail.com",
      pass: "uhijksfsevyiflzp",
    },
  });


  const sendMail = (to, subject, text, html, module) =>{


    transporter
    .sendMail({
      from: "Zaminsharma99@gmail.com",
      to: to,
      subject: subject,
      text: text,
      html: html,
    })
    .then((data) => {}).catch((err)=>console.log(module,err));
  }

module.exports = sendMail