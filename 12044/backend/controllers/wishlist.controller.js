import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res) => {
  try {
    res.send("Get user wishlist route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWishlistItem = async (req, res) => {
  try {
    res.send("Add or remove wishlist item route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
