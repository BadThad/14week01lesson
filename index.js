import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/myapp")
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Could not connect to MongoDB", error));

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted successfully", item: deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () =>
  console.log("Server is running on http://localhost:3000")
);
