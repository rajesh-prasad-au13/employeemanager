const router = require('express').Router();
const passport = require('passport');
require('../config/passport-setup')

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

module.exports = router;


// router.get('/login', (req, res) => {
//     console.log(req.user)
//     var url = "mongodb+srv://rajesh:admin@cluster0.dzaoe.mongodb.net/employee?retryWrites=true&w=majority";
//     MongoClient.connect(url, async function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("employee");
//         let anyuser = await dbo.collection('users').findOne({useremail:req.user}) 
//         console.log('abc',anyuser)
//         if (anyuser == null){
//             res.json({
//                 message:"No such user exists"
//             })
//         }
//         else{
//             res.json({
//                 message:"WElcome to individual user page"
//             })
//         }
//     });
//     // res.render('login', { user: req.user });
// });
