// const express = require('express')
const router = require('express').Router();

var MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyparser = require('body-parser')


const express = require("express")
const app = express()
const cookieSession = require('cookie-session')
// const bodyparser = require('body-parser')
const passport = require('passport')

const authRoutes = require('../../controllers/routes/auth-routes')
const profileRoutes = require('../../controllers/routes/profile-routes')
const displayAll = require('../../controllers/routes/displayAlluserOradmin')
const signup = require('../../controllers/routes/signupRoute')
const homepage = require('../../controllers/routes/homepage')

const keys = require('../../src/models/config/keys')
const path = require('path')
const employeeRouter = require('../../controllers/routes/employeeDetails')
const hbs = require('hbs')

const dotenv = require("dotenv")
dotenv.config()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

// const auth = require('./controllers/authLogin')

// const router = express.Router()
// const cloudinary = require("./src/models/utils/cloudinary")
// const upload = require("./src/models/utils/multer")
// const Employee = require("./src/models/schema/employeeschema")

// require('./controllers/employeeController')
const connect = require("../../src/db/conn")
connect()

const port = process.env.PORT || 5000

// var MongoClient = require('mongodb').MongoClient;
let admin = []

// const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")

// app.use(express.static(static_path))

app.set("view engine", "hbs")
app.set('view engine', 'ejs');
app.set("views", template_path)



router.get('/homepage',(req,res)=>{
    res.render('homepage.hbs')
})

router.post('/homepage',(req,res) => {
    // let anyuser = req.body.Email
    console.log(req.body)
    var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("employee");
        let anyuser = await dbo.collection('admins').findOne({email:req.body.Email}) 
        if(anyuser == null){
            anyuser = await dbo.collection('users').findOne({useremail:req.body.Email}) 
            console.log('abc',anyuser)
            if (anyuser == null){
                res.json({
                    message:"No such user exists"
                })
            }
            else{
                res.json({
                    message:"WElcome to indivi user page"
                })
            }
        }
        else {
            const isMatch = await bcrypt.compare(req.body.password, anyuser.password);
            if (isMatch) {
                jwt.sign(
                    { db: { email: db.email } },
                    'jwt_secret',
                    (err, token) => {
                        if (err) throw err;
                        console.log('token', token)
                        req.header.token = token
                        console.log('heree')
                        res.redirect('/allusers')
                    }
                )
            }
            else {
                res.status(404).json({
                    data: {},
                    message: "Password mismatch"
                })
            }
            db.close();
        }
    });

})


module.exports = router;