const express = require('express')
const router = express.Router()
const cloudinary = require("../src/models/utils/cloudinary");
// const upload = require("../src/models/utils/multer");
const Employee = require("../src/models/schema/employeeschema");


router.get('/', (req, res) => {
  res.render("add-edit-employee.hbs", {
      viewTitle: "Insert Employee"
  });
});


router.post('/',(req,res) => {
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

module.exports = router
