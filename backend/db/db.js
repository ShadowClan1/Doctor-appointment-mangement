const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'DAOBS',
 'admin',
 'admin@123',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging : false
  }
);

// const mongoDBConnect = async () => {
// //   await mongoose.connect("mongodb://127.0.0.1:27017/DAOBS"); 
// };






module.exports = {Sequelize, sequelize};
