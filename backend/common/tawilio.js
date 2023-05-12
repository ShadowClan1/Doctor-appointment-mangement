// const accountSid = 'AC504eba691fd6df2f250bd47ed43d5e8'; // Your Account SID from www.twilio.com/console
const accountSid = 'AC504eba691fd6df2f250bd47ed43d5e8c'; // Your Account SID from www.twilio.com/console
const authToken = 'c049becaed9b96b6e1589bf3523c7f5d'; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

 

const sendMessage = (to, body) =>{
  console.log({to : to, body : body})
   client.messages
            .create({
              body: body,
              to: `+91${to}`, // Text this number
              from: "+15075797269", // From a valid Twilio number
            })
            .then((message) => console.log(message.sid)).catch((err)=>{
              console.log(err)
            });
}



  module.exports = sendMessage;   