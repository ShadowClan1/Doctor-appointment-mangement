const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const User = sequelize.define("users", {
  
  id : {
   type :  DataTypes.STRING,
    allowNull : false,
    primaryKey : true
  }
  ,
  verified : {
    type :  DataTypes.STRING,
     allowNull : false,
   
   } 
  ,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.CHAR,
    allowNull: false,
  },

  lastModified: { 
    type: DataTypes.DATEONLY,
  
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mNumber : {
    type: DataTypes.STRING,
    allowNull: false
  },
  token : {
    type : DataTypes.STRING
   },
   validTill : {
    type : DataTypes.DATE
   }, 
   temp : {
    type : DataTypes.STRING
   }



});

const Doctor = sequelize.define("doctors", {
  id : {
    type :  DataTypes.STRING,
     allowNull : false,
     primaryKey : true
   }
  ,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  maxSeats: {
    type: DataTypes.INTEGER,
  },

  gender: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospital: {
    type: DataTypes.STRING,
  },

  lastModified: {
    type: DataTypes.STRING,
   
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  mNumber : {
    type: DataTypes.STRING,
    allowNull: false
  },
  verified : {
    type :  DataTypes.STRING,
     allowNull : false,
   
   } , token : {
    type : DataTypes.STRING
   },
   validTill : {
    type : DataTypes.DATE
   }, 
   temp :{
    type : DataTypes.STRING
   }

});

const Appointment = sequelize.define("appointments", {
  id : {
    type :  DataTypes.STRING,
     allowNull : false,
     primaryKey : true
   },
  patientId : {
    type : DataTypes.STRING,
    allowNull : false
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visitTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },

status : {
  type : DataTypes.STRING
}
  ,
  seenU: {
    type: DataTypes.STRING,
    allowNull : false
  },
  seenD: {
    type: DataTypes.STRING,
    allowNull : false
  },
  remarks: {
    type: DataTypes.STRING,
  },
  AvailSeats: {
    type: DataTypes.INTEGER,
  },

  location: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  hospital: {
    type: DataTypes.STRING,
  },

  lastModified: {
    type: DataTypes.DATE,
    
  },
  charged : {
    type: DataTypes.INTEGER
  }
 
});

// const Date = sequelize.define("dates", { 
//     date : {
//       type: DataTypes.TIME,
//       allowNull: false,
//     }
//   });


sequelize
  .sync()
  .then(() => {
    console.log(" table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = { User, Doctor, Appointment };
