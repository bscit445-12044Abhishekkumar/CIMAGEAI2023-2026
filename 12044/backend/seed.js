import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const categoriesData = [
  { name: "Clothing", description: "Premium apparel and garments" },
  { name: "Accessories", description: "Stylish fashion accessories" },
  { name: "Footwear", description: "Quality designer shoes" },
  { name: "Bags", description: "Handcrafted bags and totes" },
  { name: "Watches", description: "Luxury timepieces" }
];

const productsData = [
  {
    title: "Premium Linen Blazer",
    description: "Crafted from the finest Italian linen, this blazer combines effortless style with unmatched comfort. Perfect for both casual and formal occasions.",
    price: 189,
    categoryName: "Clothing",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop"],
    stock: 10,
    featured: true
  },
  {
    title: "Artisan Leather Tote",
    description: "Handcrafted from full-grain leather with meticulous attention to detail. Spacious interior with organized compartments.",
    price: 245,
    categoryName: "Bags",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=700&fit=crop"],
    stock: 15,
    featured: true
  },
  {
    title: "Minimalist Chronograph",
    description: "A timeless chronograph with Swiss movement, sapphire crystal, and genuine leather strap. Water resistant to 50m.",
    price: 320,
    categoryName: "Watches",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=700&fit=crop"],
    stock: 8,
    featured: true
  },
  {
    title: "Cashmere Crew Sweater",
    description: "Pure Mongolian cashmere, incredibly soft and warm. Relaxed fit with ribbed cuffs and hem.",
    price: 165,
    categoryName: "Clothing",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=700&fit=crop"],
    stock: 12,
    featured: false
  },
  {
    title: "Italian Suede Loafers",
    description: "Handmade in Italy from the finest suede. Blake-stitched construction for durability and elegance.",
    price: 210,
    categoryName: "Footwear",
    images: ["https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=700&fit=crop"],
    stock: 7,
    featured: false
  },
  {
    title: "Silk-Blend Scarf",
    description: "Luxurious silk-wool blend with a sophisticated pattern. Versatile enough for any season.",
    price: 85,
    categoryName: "Accessories",
    images: ["https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=600&h=700&fit=crop"],
    stock: 20,
    featured: false
  },
  {
    title: "Canvas Weekend Bag",
    description: "Waxed canvas with leather trim. The perfect companion for short trips with ample storage.",
    price: 175,
    categoryName: "Bags",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=700&fit=crop"],
    stock: 5,
    featured: false
  },
  {
    title: "Aviator Sunglasses",
    description: "Polarized lenses with titanium frames. UV400 protection with anti-reflective coating.",
    price: 145,
    categoryName: "Accessories",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=700&fit=crop"],
    stock: 25,
    featured: true
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    console.log('✅ Collections Cleared');

    // Create Categories first
    const createdCategories = await Category.insertMany(categoriesData);
    console.log('✅ Categories Seeded');

    // Prepare Products with Category IDs
    const productsWithCategory = productsData.map(product => {
      const category = createdCategories.find(c => c.name === product.categoryName);
      return {
        ...product,
        category: category._id
      };
    });

    // Create Products
    await Product.insertMany(productsWithCategory);
    console.log('✅ Products Seeded');

    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
