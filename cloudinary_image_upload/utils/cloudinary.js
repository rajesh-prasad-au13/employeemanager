const cloudinary = require("cloudinary").v2;
const express = require('express')
const app = express();

const fileupload = require('express-fileupload');
app.use(fileupload());

app.post


cloudinary.config({
  cloud_name: 'dwaw3z3ex',
  api_key: '619386553959379',
  api_secret: 'Kn2pvV1Y04DWuPi46BmBOqatNNw'
});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

module.exports = cloudinary;