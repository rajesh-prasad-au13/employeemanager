// require('./models/db')
// const express = require('express')
// const app = express()
// const employeeRouter = require('./controllers/employeeController')
// const bodyParser = require('body-parser')
// const path = require('path')
// const exphbs = require('express-handlebars')
// const dotenv = require("dotenv");
// dotenv.config();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}))

// app.set('views', path.join(__dirname, '/views/'));
// // app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
// app.set('view engine', 'hbs');
// // app.get('/',(req,res)=>{
// //     res.send({message:Successful})
// // })

// app.use('/employee', employeeRouter)


// app.listen(5000,()=>{
//     console.log("Connected to http://localhost:5000")
// })





// passport.use (
//     new GoogleStrategy({
//     clientID: keys.googleClientID,
//     clientSecret: keys.googleClientSecret,
//     callbackURL: '/auth/google/callback',
//     proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//          const existingUser = await User.findOne({googleID: profile.id});

//         if(!existingUser) {
//             const user = await User.create({googleID: profile.id}).save()
//             return done(null, user)
//         }

//         done(null, existingUser)
//     })


//     passport.use (
//         new GoogleStrategy({
//         clientID: keys.googleClientID,
//         clientSecret: keys.googleClientSecret,
//         callbackURL: '/auth/google/callback',
//         proxy: true
//         },
//         async (accessToken, refreshToken, profile, done) => {
//              const existingUser = await User.findOne({googleID: profile.id});
    
//             if(!existingUser) {
//                 const user = await User.create({googleID: profile.id}).save()
//                 return done(null, user)
//             }
    
//             done(null, existingUser)
    
    
//         })
//     )    