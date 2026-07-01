require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fuzzmart';

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const mockProducts = [
        { title: 'Premium Eco Bottle', price: 25, imageUrl: 'https://i.imgur.com/4RXpcK4.jpeg', description: 'Stay hydrated with this premium stainless steel matte green water bottle.' },
        { title: 'DSLR Pro Camera', price: 899, imageUrl: 'https://i.imgur.com/rXwMO3L.jpeg', description: 'Capture professional-grade photographs with 24.2 MP and 4K recording.' },
        { title: 'Minimalist Wooden Chair', price: 45, imageUrl: 'https://i.imgur.com/3RZxc9K.jpeg', description: 'Sleek and modern wooden stool perfect for workspace minimalism.' },
        { title: 'Studio Bass Headphones', price: 120, imageUrl: 'https://i.imgur.com/xzJgbpW.jpeg', description: 'Wireless over-ear noise-cancelling headphones with pure bass sound.' },
        { title: 'Aero Sport Shoes', price: 85, imageUrl: 'https://i.imgur.com/FxLRYPN.jpeg', description: 'Lightweight breathable running sneakers with premium grip sole.' },
        { title: 'Classic Urban Sunglasses', price: 35, imageUrl: 'https://i.imgur.com/EQO1lJJ.jpeg', description: 'Polarized stylish matte black sunglasses with 100% UV protection.' },
        { title: 'Minimalist White Watch', price: 150, imageUrl: 'https://i.imgur.com/vAfyN7k.jpeg', description: 'Elegant premium white smartwatch with custom dynamic watch faces.' }
      ];
      await Product.insertMany(mockProducts);
      console.log("🌱 Database successfully seeded with initial products!");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

mongoose.connect(mongoURI)
  .then(async () => {
    console.log("🚀 MongoDB Connected successfully!");
    await seedProducts(); 
    app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
  });

app.post('/api/users/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();
    return res.status(201).json({ message: "🎯 Registration Successful!" });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error during registration" });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is incorrect!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is incorrect!" });
    }

    const token = jwt.sign({ email: user.email }, 'FUZZ_SUPER_SECRET_KEY', { expiresIn: '1h' });

    return res.json({
      message: "Login Successful!",
      token,
      user: { email: user.email }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { title, price, imageUrl, description } = req.body;
    const newProduct = new Product({ title, price, imageUrl, description });
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: "Server error while creating product" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error while deleting product" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching products" });
  }
});