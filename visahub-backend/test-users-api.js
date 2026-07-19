const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign(
  { id: 1, email: 'ranjan.ar855@gamil.com', role: 'admin' }, 
  process.env.JWT_SECRET, 
  { expiresIn: '12h' }
);

fetch('http://localhost:5000/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
