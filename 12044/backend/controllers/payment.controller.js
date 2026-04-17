import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment-cancel`,
      metadata: {
        orderId: orderId.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const processPayment = async (req, res) => {
  try {
    res.send("Process payment route");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.payment_status === "paid") {
      const orderId = session.metadata.orderId;

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date(),
          paymentStatus: "paid",
        },
        { new: true }
      );

      await Payment.create({
        user: req.user._id,
        order: orderId,
        amount: session.amount_total / 100,
        paymentMethod: "stripe",
        transactionId: session.payment_intent,
        status: "success",
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    }

    res.status(400).json({
      success: false,
      message: "Payment not completed",
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
