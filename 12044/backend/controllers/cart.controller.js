import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    res.send("Get user cart route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    res.send("Add item to cart route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    res.send("Remove item from cart route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
