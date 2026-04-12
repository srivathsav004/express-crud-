const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { default: mongoose } = require('mongoose');
const app = express();

const Product = require('./models/product.model');

app.use(express.json());

app.post('/products', async (req, res) => {
    try {
        const { name, quantity, price, image } = req.body;
        const newProduct = new Product({ name, quantity, price, image });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ message: 'Products retrieved successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product retrieved successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product', error });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const { name, quantity, price, image } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, quantity, price, image },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data', error });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});


mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log('Connected to MongoDB');   
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

