import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// Helper function to resolve category name to ObjectId
const resolveCategoryId = async (categoryInput) => {
  if (!categoryInput) return null;
  const input = categoryInput.trim();

  // If already a valid MongoDB ID, return it
  if (mongoose.Types.ObjectId.isValid(input)) {
    return input;
  }

  // Otherwise, search for a category with that name (case-insensitive)
  let category = await Category.findOne({ name: { $regex: new RegExp(`^${input}$`, 'i') } });

  // If not found, create it
  if (!category) {
    category = await Category.create({ name: input });
  }

  return category._id;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { title, description, price, category: categoryInput, images, stock } = req.body;

  try {
    // Resolve category name to ID
    const categoryId = await resolveCategoryId(categoryInput);

    const product = new Product({
      title,
      description,
      price,
      category: categoryId,
      images,
      stock: stock || 10,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { title, description, price, category: categoryInput, images, stock } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Resolve category name to ID if provided
      if (categoryInput) {
        product.category = await resolveCategoryId(categoryInput);
      }

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.images = images || product.images;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
