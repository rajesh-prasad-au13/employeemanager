const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
const auth = require('../../controllers/authLogin')


router.get('/alladmin', auth, (req, res) => {
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

router.get('/allusers', auth, (req, res) => {
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

router.get('/alladmin/:email',auth,(req,res) => {
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

router.get('/allusers/:email',(req,res) => {
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

module.exports = router