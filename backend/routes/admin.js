const { Doctor, User, Appointment } = require('../model/Model')

const app = require('express').Router()
app.get('/admin-get-all-docs', (req, res)=>{
    Doctor.findAll({}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})
app.get('/admin-get-all-users', (req, res)=>{
    User.findAll({}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})
app.get('/admin-get-all-appointments', (req, res)=>{
    Appointment.findAll({}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})
app.get('/admin-get-appointments/:id', (req, res)=>{
    Appointment.findAll({where : {
        id : req.params.id
    }}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})

app.get('/get-appointments-by-paitentid/:id', (req, res)=>{
    Appointment.findAll({where : {
        patientId : req.params.id
    }}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})
app.get('/get-appointments-by-doctorid/:id', (req, res)=>{
    Appointment.findAll({where : {
        doctorId : req.params.id
    }}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})

app.patch('/cancel-appointment-by-id/:id', (req, res)=>{
    Appointment.update({status : 'Canceled', remarks : "Canceled by admin"},{where : {
        id : req.params.id
    }}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})


app.delete('/delete-appointment-by-id/:id', (req, res)=>{
    Appointment.destroy({where : {
        id : req.params.id
    }}).then(data=>res.status(400).json({data})).catch((err)=>{
        res.status(400).json({err})
    })
})





module.exports = app