// const mongoose = require('mongoose')
// mongoose.connect("mongodb://localhost:27017/employees", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }).then(() => {
//     console.log(`Connection Successfull`)
// }).catch((e) => {
//     console.log(`Connection Unsuccessful`)
// })
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://rajesh:rajesh@123@cluster0.esvp7.mongodb.net/employeemanager?retryWrites=true&w=majority", () => {
        console.log('connected to mongodb');
    });
    
// require('../../src/models/Employee')


// mongoose.connect("mongodb://localhost:27017/employees", {
//         useCreateIndex: true,
//         useNewUrlParser: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true,
// })
// .then(() => console.log("mongoDB is connected"))
// .catch((err) => console.log(err));
