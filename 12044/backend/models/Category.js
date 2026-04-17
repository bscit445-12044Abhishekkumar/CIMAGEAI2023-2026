import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
