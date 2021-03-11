const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    
    console.log('reqq',req.user)
    res.render('profile.ejs', { user: req.user });

    // var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
    // MongoClient.connect(url, async function (err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("employee");
    //     let anyuser = await dbo.collection('users').findOne({useremail:req.user.useremail}) 
    //     console.log('abc',anyuser)
    //     if (anyuser == null){
    //         res.json({
    //             message:"No such user exists"
    //         })
    //     }
    //     else{
    //         res.render('profile.ejs', { user: req.user });
    //     }
    // });
    // // 
});

module.exports = router;