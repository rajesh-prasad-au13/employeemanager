const express = require("express")
const app = express()
const cookieSession = require('cookie-session')
const bodyparser = require('body-parser')
const passport = require('passport')
const authRoutes = require('./controllers/auth-routes')
const profileRoutes = require('./controllers/profile-routes')
const keys = require('./src/models/config/keys')
const path = require('path')
const employeeRouter = require('./controllers/employeeController')
const hbs = require('hbs')
const mySchema = require("./src/models/schema/adminschema")

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const dotenv = require("dotenv")
dotenv.config()

const auth = require('./controllers/authLogin')

const router = express.Router()
// const cloudinary = require("./src/models/utils/cloudinary")
const upload = require("./src/models/utils/multer")
const Employee = require("./src/models/schema/employeeschema")

require('./controllers/employeeController')
const connect = require("./src/db/conn")
connect()

const port = process.env.PORT || 5000

var MongoClient = require('mongodb').MongoClient;
let admin = []

const static_path = path.join(__dirname, "./public")
const template_path = path.join(__dirname, "./templates/views")
// const Employee = require("./src/models/schema/employeeschema");

app.use(express.static(static_path))

app.set("view engine", "hbs")
app.set('view engine', 'ejs');
app.set("views", template_path)

// app.use('/employee', employeeRouter)
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

const cloudinary = require("cloudinary").v2;
var fileupload = require('express-fileupload')
app.use(fileupload({useTempFiles:true}))


cloudinary.config({
    cloud_name: 'dwaw3z3ex',
    api_key: '619386553959379',
    api_secret: 'Kn2pvV1Y04DWuPi46BmBOqatNNw'
  });

app.get('/employee', (req, res) => {
    res.render("add-edit-employee.hbs", {
        viewTitle: "Insert Employee"
    });
});

app.post('/employee',(req,res) => {
    const file = req.files.image
    console.log(req.files.image)
    cloudinary.uploader.upload(file.tempFilePath, async (err,result)=>{
        console.log('err',err)
        console.log('result',result)
        try {
            let employee = new Employee({
              firstname: req.body.firstname || '',
              lastname: req.body.lastname || '',
              email: req.body.email || '',
              phone: req.body.phone || '',
              address: req.body.address || '',
              pancard: req.body.pancard || '',
              cloudinary_id: result.secure_url || '',
              basicsalary: req.body.basicsalary || '',
              da: req.body.da || '',
              hra: req.body.hra || '',
              medical: req.body.medical || '',
              proftax: req.body.proftax || '',
              incometax: req.body.incometax || '',
              providentfund: req.body.providentfund || ''
            });
        
            // Save user
            const ans = await employee.save();
            console.log('ans',ans)
            res.end()
          } 
          catch (err) {
            console.log(err);
            res.end()
          }

    })

})


// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home.ejs', { user: req.user });
});

app.get('/homepage',(req,res)=>{
    res.render('homepage.hbs')
})

app.post('/homepage',(req,res) => {
    let anyuser = req.body.Email
    console.log(req.body.Email)
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
                        // res.status(200).json({
                        //     data: { token },
                        //     // errors:[],
                        //     message: 'Loggin success!!'
                        // })
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

app.get('/signup', (req, res) => {
    const data = {
        admin,
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirm_password: ''
    }
    res.render(template_path + '/signup.hbs', data);      //.hbs extension is not required
})

app.post('/signup', async (req, res) => {
    console.log(req.body, req.body.password == req.body.confirm_password)
    try {
        if (req.body.password == req.body.confirm_password) {
            console.log("here")
            const registerEmployee = new mySchema({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password
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
        else {
            res.send("Password Mismatched")
        }
    }
    catch (error) {
        res.status(400).send(error)
    }
})

app.get('/alladmin', auth, (req, res) => {
    console.log("here 1 ")
    var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    MongoClient.connect(url, function (err, db) {
        console.log("here 2 ")
        if (err) throw err;
        var dbo = db.db("employee");
        dbo.collection('admins').find({}).toArray((err, db) => {
            //return res.send(data)
            console.log("Listing all Admins ")
            res.render('showadmins.ejs', { data: db })
        })
    });
})

app.get('/allusers', auth, (req, res) => {
    console.log("here 1 ")
    var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    MongoClient.connect(url, function (err, db) {
        console.log("here 2 ")
        if (err) throw err;
        var dbo = db.db("employee");
        dbo.collection('users').find({}).toArray((err, db) => {
            console.log("Listing all Users ")
            res.render('showusers.ejs', { data: db })
        })
    });
});

app.get('/alladmin/:email',auth,(req,res) => {
    console.log(req.params.email)
    console.log("here 1 ")
    var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    MongoClient.connect(url, function (err, db) {
        console.log("here 2 ")
        if (err) throw err;
        var dbo = db.db("employee");
        dbo.collection('admins').findOne({email:req.params.email}, function(err, db) {
            //return res.send(data)
            console.log("Listing One with Email ",db)

            res.render('oneadmin.hbs', { db })
        })
    });
})

app.get('/allusers/:email',(req,res) => {
    console.log(req.params.email)
    console.log("here 1 ")
    var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    MongoClient.connect(url, function (err, db) {
        console.log("here 2 ")
        if (err) throw err;
        var dbo = db.db("employee");
        dbo.collection('users').findOne({email:req.params.email}, function(err, db) {
            //return res.send(data)
            console.log("Listing One with Email ",db)

            res.render('auser.hbs', { db })
        })
    });
})

app.get('/logout',(req,res)=>{
    res.redirect('/homepage')
})

app.listen(port, () => {
    console.log(`Server running at ${port}`) //5000
})
