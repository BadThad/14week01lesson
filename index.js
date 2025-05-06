import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/myapp");

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
});

const Item = mongoose.model("Item", itemSchema);

app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post("/items", async (req, res) => {
try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
} catch (error) {
    res.status(400).json({ message: error.message });
}});

app.listen(3000, () => console.log("Server is running on http://localhost:3000"));