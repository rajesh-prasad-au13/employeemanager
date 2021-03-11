const router = require('express').Router()
const mySchema = require("../../src/models/schema/adminschema")

router.get('/signup', (req, res) => {
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

router.post('/signup', async (req, res) => {
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

module.exports = router