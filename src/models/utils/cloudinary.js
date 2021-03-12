const cloudinary = require("cloudinary").v2;


// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret
// });

cloudinary.config({
  cloud_name: 'dwaw3z3ex',
  api_key: '619386553959379',
  api_secret: 'Kn2pvV1Y04DWuPi46BmBOqatNNw'
});

module.exports = cloudinary;