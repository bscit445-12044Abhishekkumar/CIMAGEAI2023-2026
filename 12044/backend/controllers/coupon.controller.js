import Coupon from '../models/Coupon.js';

export const createCoupon = async (req, res) => {
  try {
    res.send("Create coupon route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    res.send("Apply coupon route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
