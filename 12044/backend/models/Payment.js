import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  paymentId: String,
  amount: Number,
  method: String,
  status: String
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
