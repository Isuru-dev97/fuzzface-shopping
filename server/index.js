const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();


app.use(express.json());
app.use(cors());


const DUMMY_USER = {
  email: "test@fuzzmart.com",
  password: "password123"
};


app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  console.log("Backend received data:", { email, password });

  
  if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
    
    const token = jwt.sign({ email }, 'FUZZ_SUPER_SECRET_KEY', { expiresIn: '1h' });

    return res.json({
      message: "Login Successfull!",
      token,
      user: { email }
    });
  }

  
  return res.status(401).json({ message: "email or password is incorrect!" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));