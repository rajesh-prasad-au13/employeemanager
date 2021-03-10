const express = require('express');
const router = require("express").Router();
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");
const cloudinary = require("cloudinary").v2;

const User = require("../model/user");

const fileupload = require('express-fileupload');
router.use(fileupload());

cloudinary.config({
  cloud_name: 'dwaw3z3ex',
  api_key: '619386553959379',
  api_secret: 'Kn2pvV1Y04DWuPi46BmBOqatNNw'
});

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);
//     // res.json(result)
//     // Create new user
//     let user = new User({
//       name: req.body.name,
//       avatar: result.secure_url,
//       cloudinary_id: result.public_id,
//     });
//     // Save user
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     let user = await User.find();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     // Find user by id
//     let user = await User.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Delete user from db
//     await user.remove();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     let user = await User.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);
//     const data = {
//       name: req.body.name || user.name,
//       avatar: result.secure_url || user.avatar,
//       cloudinary_id: result.public_id || user.cloudinary_id,
//     };
//     user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

router.post('/employee', (req,res) => {
  console.log(req.files.image);
})

module.exports = router;