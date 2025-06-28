import express from "express"; // Importing express router
import Product from "../models/product.model.js"; // Importing the product model

const router = express.Router(); // Creating a new router instance

router.route("/").post(async (req, res) => {
  const product = req.body;
  if (!product || !product.name || !product.price || !product.image) {
    return res.status(400).json({ message: "Invalid product data" });
  }
  const { name, price, image } = product;
  console.log(product);
  // Validate the product data
  if (
    !name ||
    typeof name !== "string" ||
    !price ||
    isNaN(Number(price)) ||  // notice that number was in json format
    !image ||
    typeof image !== "string"
  ) {
    console.log(product);
    return res.status(400).json({ message: "Invalid product data" });
  }
  try {
    const newProduct = new Product(product);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

router.route("/").get(async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

router.route("/:id").delete(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res.status(200).json({ message: "Product deleted successfully", success:true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", success: false });
  }
});
router.route("/:id").patch(async (req, res) => {
  const { name, price, image } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res
      .status(200)
      .json({
        message: "Product updated successfully",
        product,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", success: false });
  }
});

export default router;