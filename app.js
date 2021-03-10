const express = require("express");
const app = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
// const passportSetup = require('./config/passport-setup');
// const mongoose = require('mongoose');
const keys = require('./config/keys');
const path = require('path')
const employeeRouter = require('./controllers/employeeController')
// const exphbs = require('express-handlebars')
const hbs = require('hbs')
const bodyparser = require('body-parser')
const mySchema = require("./src/models/adminschema")

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
// const { check, validationResult } = require('express-validator')

const dotenv = require("dotenv");
dotenv.config();

const auth = require('./routes/authLogin')

const router = express.Router()
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
const Employee = require("./src/models/employeeschema");
// const employeeGoogle= require("./src/models/employeeGoogleSigninSchema");

require('./controllers/employeeController')
const connect = require("./src/db/conn")
connect()

const port = process.env.PORT || 5000

var MongoClient = require('mongodb').MongoClient;

// let users = []

let admin = []

const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")
const partials_path = path.join(__dirname, "./templates/partials")
hbs.registerPartials(partials_path)

// app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));

app.use(express.static(static_path))

app.set("view engine", "hbs")
app.set('view engine', 'ejs');
app.set("views", template_path)

app.use('/employee', employeeRouter)
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true})) 
// Route
app.use('/user', require('./cloudinary_image_upload/routes/user'))

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    // console.log(req)
    res.render('home.ejs', { user: req.user });
});

app.get('/home', (req, res) => {
    console.log(req.body)
    var url = "mongodb+srv://rajesh:rajesh@123@cluster0.esvp7.mongodb.net/employeemanager?retryWrites=true&w=majority";
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("employees");
    dbo.collection("registers").findOne({}, function(err, result) {
        if (err) throw err;
        console.log(result)
        
        //object to array
        const propertyNames = Object.values(result);
        console.log(propertyNames);
        const data = {propertyNames}
        
        console.log(data)
        res.render('home.hbs',data) 
        
        db.close()
       });
    });
    // res.end() 
});

app.get('/see', auth, (req, res) => {
    res.json("Welcome to Your Profile Section")
});


app.get('/login', (req, res) => {
  res.render('login.hbs');
});


app.post('/login',(req,res) => {
    console.log(req.body)
    console.log(req.header.token)
    var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("employee");
    dbo.collection("admins").findOne({}, async function(err, result) {
        if (err) throw err;

        console.log(req.body.password, result.password)
        if(result){
            const isMatch = await bcrypt.compare(req.body.password, result.password);
            if(isMatch){
                jwt.sign(
                    { result: { email: result.email } },
                    'jwt_secret',
                    (err, token) => {
                        if (err) throw err;
                        console.log('token',token)
                        req.header.token = token
                        console.log('heree')
                        res.status(200).json({
                            data: {token},
                            // errors:[],
                            message: 'Loggin success!!'
                        })
                    }
                )
            }
            else{
                res.status(404).json({
                    data:{},
                    message:"Password mismatch"
                })
            }
            db.close();
        }
        else{
            res.status(200).json({
                data: {},
                // errors:[],
                message: 'No such User'
            })
            db.close();
        }
    });
    });
    // res.end()
} );


app.get('/signup',(req,res) => {
    const data = {
        admin,
        firstname: '',
        lastname:'',
        email: '',
        password: '',
        confirm_password:''
      }
    res.render(template_path +'/signup.hbs',data);      //.hbs extension is not required
})


app.post('/signup', async (req,res) => {
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         data: {},
    //         errors: errors.array(),
    //         message: 'Unable to create user'
    //     });
    // }
    // try {
    //     let user = await User.findOne({ email: req.body.email });
    //     if (user) {
    //         return res.status(400).json({
    //             data: {},
    //             errors: [{
    //                 value: req.body.email,
    //                 msg: "User already exists.",
    //                 param: "email",
    //                 location: "body"
    //             }],
    //             message: 'Unable to create user'
    //         })
    //     }
    //     user = new User({
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName || '',
    //         email: req.body.email
    //     });
    //     const salt = await bcrypt.genSalt(10);
    //     user.password = await bcrypt.hash(req.body.password, salt);

    //     await user.save();

    //     res.status(200).json({
    //         data: user,
    //         errors: [],
    //         message: 'Signed Up successfully!!'
    //     });
    // } catch (e) {
    //     console.log(e.message);
    //     res.status(500).send('Error in Saving');
    // }
    console.log(req.body,req.body.password == req.body.confirm_password)
    try{
        if(req.body.password == req.body.confirm_password){
            console.log("here")
            const registerEmployee = new mySchema({
                firstname : req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:req.body.password
            })
            console.log(registerEmployee)

            const salt = await bcrypt.genSalt(10);
            // console.log(salt)
            registerEmployee.password = await bcrypt.hash(req.body.password, salt); 
            console.log(salt, registerEmployee.password)

            const result = await registerEmployee.save()

            res.status(200).json({
                // data: {},
                // errors: [],
                message: 'Signed Up successfully!!'
            });

        }
        else{
            res.send("Password Mismatched")
        }
    }
    catch(error){
        res.status(400).send(error)
    }
} )


// app.get('/admins',(req,res) => {
//     console.log(admin)
//     res.json(admin)
// })

// app.post('/admins', async (req,res) => {
//     console.log('heree')
//     try{
//         if(req.body.password == req.body.confirm_password){
//             const registerEmployee = new mySchema({
//                 firstname : req.body.firstname,
//                 lastname:req.body.lastname,
//                 email:req.body.email,
//                 password:req.body.password,
//                 confirm_password:req.body.confirm_password
//             })
//             const result = await registerEmployee.save()
//             console.log(result,registerEmployee,req.body.firstname)
//             res.status(201).render('index.hbs')
//         }
//         else{
//             res.send("Password Mismatched")
//         }
//     }
//     catch(error){
//         res.status(400).send(error)
//     }
// })

const User = require('./cloudinary_image_upload/routes/user');
app.use('/cloudinary', User);

app.listen(port, () => {
  console.log(`Server running at ${port}`) //5000
})
