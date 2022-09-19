const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/apidb", () => {
  console.log("connected to the mongoose server");
});
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});
const Product = new mongoose.model("Product", productSchema);

app.listen(4500, () => {
  console.log("Connected", "http://localhost:4500");
});
// create product
app.post("/api/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: "true" });
});
// Read product
app.get("/api/v1/products", async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: "true", products });
});
// Update Product
app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, product });
});
//delete product
app.delete("/api/v1/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(!product){
    return res
    .status(500)
    .json({ success: false, message: "product not found " });
  }
  await product.remove;
  res
    .status(200)
    .json({ success: true, message: "product is deleted successfully" });
});
