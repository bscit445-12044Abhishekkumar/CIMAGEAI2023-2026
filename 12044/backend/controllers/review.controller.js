import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  try {
    res.send("Add product review route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    res.send("Get product reviews route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
