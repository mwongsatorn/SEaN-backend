const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const dotenv = require('dotenv')

dotenv.config();

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

async function seedingActivity() {
    await User.deleteMany({});
    const types = ['Force', 'Regular', 'Volunteer', 'Others']
    const faculty = ['Engineering','P.E','Humanities','Science','Economics','Dentistry','COSCI','Medicine', 'Social science']
    for(let i = 0; i < 20; i++) {
        const random_types = Math.floor(Math.random() * 5)
        const random_id = Math.floor(Math.random() * 8)
        const random_fac  = Math.floor(Math.random() * 10)
        const user = new User({
            name: `Activity${i}`,
            Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eros orci, pretium ut vehicula nec, pulvinar a est. Vivamus dignissim augue justo, id cursus nunc sagittis at. In auctor diam id convallis viverra. Proin pharetra mattis posuere. Duis ultricies vestibulum nulla, sit amet dictum augue egestas eget. Aliquam erat volutpat. Nulla sit amet velit id lacus tincidunt tempus non vitae erat. Curabitur luctus hendrerit ex sed iaculis. Sed rhoncus arcu a purus maximus, quis scelerisque ipsum cursus viverra.',
            type: `Firstname${i}`,
            lastname: `Lastname${i}`,
            createdBy: `"User000${i}@gmail.com"`,
            scholar_id: "en60109010522",
            faculty: "Engineering",
            department: "Computer Engineering",
            tel_no: "0623467986"
        })
    
        const addedUser = await user.save();
        console.log(addedUser)
    }
}

seedingActivity().then(() => {
    mongoose.connection.close()
});