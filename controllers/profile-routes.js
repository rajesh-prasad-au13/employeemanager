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

});

module.exports = router;