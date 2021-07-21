const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

require('dotenv').config({path: '../.env'});

//Database connections
mongoose.connect(
    process.env.DB_CONNECT, 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log("DATABASE CONNECTED")
    }).catch(err => {
        console.log("CAN NOT CONNECT TO DATABASE")
        console.log(err)
    })

async function seedingUser() {
    await User.deleteMany({});
    const faculty = ['Engineering','P.E','Humanities','Science','Economics','Dentistry','COSCI','Medicine','Social science']
    for(let i = 0; i < 50; i++) {
        const pw = `User000${i+1}`
        const random_fac  = Math.floor(Math.random() * 9)
        const fac = faculty[random_fac]
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(pw, salt)
        const user = new User({
            username: `User000${i+1}`,
            password: hashedPassword,
            firstname: `Firstname${i+1}`,
            lastname: `Lastname${i+1}`,
            email: `"User000${i+1}@gmail.com"`,
            status_id: `iduser000${i+1}`,
            status: 'Student',
            faculty: fac,
            tel_no: `00000000-${i}`
        })
    
        const addedUser = await user.save();
        console.log(fac)
    }
}

seedingUser().then(() => {
    mongoose.connection.close()
}).catch((e) => {
    console.log(e)
});