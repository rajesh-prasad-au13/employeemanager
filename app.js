const express = require("express")
const app = express()
const cookieSession = require('cookie-session')
const bodyparser = require('body-parser')
const passport = require('passport')

const authRoutes = require('./controllers/routes/auth-routes')
const profileRoutes = require('./controllers/routes/profile-routes')
const displayAll = require('./controllers/routes/displayAlluserOradmin')
const signup = require('./controllers/routes/signupRoute')
const homepage = require('./controllers/routes/homepage')

const keys = require('./src/models/config/keys')
const path = require('path')
const employeeRouter = require('./controllers/routes/employeeDetails')
const hbs = require('hbs')

const dotenv = require("dotenv")
dotenv.config()

// const auth = require('./controllers/authLogin')

const router = express.Router()
const cloudinary = require("./src/models/utils/cloudinary")
const upload = require("./src/models/utils/multer")
const Employee = require("./src/models/schema/employeeschema")

// require('./controllers/employeeController')
const connect = require("./src/db/conn")
connect()

const port = process.env.PORT || 5000

// var MongoClient = require('mongodb').MongoClient;
let admin = []

const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")

app.use(express.static(static_path))

app.set("view engine", "hbs")
app.set('view engine', 'ejs');
app.set("views", template_path)

app.use('/employee', employeeRouter)
app.use('/',homepage)
app.use('/',signup)
app.use('/',displayAll)

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
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
    res.render('home.ejs', { user: req.user });
});


app.get('/logout',(req,res)=>{
    res.redirect('/homepage')
})

app.listen(port, () => {
    console.log(`Server running at ${port}`) //5000
})
