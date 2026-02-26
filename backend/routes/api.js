const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Product = require("../models/Product");
const Area = require("../models/Area");
const User = require("../models/User");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "API working" });
});

// ================== USER ROUTES ==================

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      username: user.username,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create initial users (run once to setup)
router.post("/setup-users", async (req, res) => {
  try {
    await User.deleteMany({}); // Clear existing users

    const users = await User.insertMany([
      {
        username: "admin",
        password: "admin123",
        name: "Admin User",
        role: "admin"
      },
      {
        username: "employee",
        password: "emp123",
        name: "John Employee",
        role: "employee"
      }
    ]);

    res.json({ message: "Users created", users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== AREA ROUTES ==================
router.get("/areas", async (req, res) => {
  try {
    const areas = await Area.find();
    console.log(`📋 Fetched ${areas.length} areas from database`);
    res.json(areas);
  } catch (err) {
    console.error('Error fetching areas:', err);
    res.status(500).json({ error: err.message });
  }
});
// Create Area with option to create slots
router.post("/area", async (req, res) => {
  try {
    const { name, createSlots, slotCount } = req.body;

    // Check if area already exists
    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res.status(400).json({ message: "Area already exists" });
    }

    const area = await Area.create({ name });

    // If createSlots is true, create default slots
    if (createSlots && slotCount > 0) {
      // Extract section letter from area name
      let sectionLetter = name;
      sectionLetter = sectionLetter.replace(/^(Section|Area|Zone)\s*/i, '');
      sectionLetter = sectionLetter.replace(/^(Section|Area|Zone)-*/i, '');
      sectionLetter = sectionLetter.trim();

      if (sectionLetter.includes(' ')) {
        const parts = sectionLetter.split(' ');
        sectionLetter = parts[parts.length - 1];
      }

      const slots = [];
      for (let i = 1; i <= slotCount; i++) {
        slots.push({
          area: name,
          slotId: `${sectionLetter}-${i}`,
          isEmpty: true,
          productId: null
        });
      }

      await Slot.insertMany(slots);
      return res.json({
        message: "Area and slots created successfully",
        area,
        slotsCreated: slots.length
      });
    }

    res.json({ message: "Area created successfully", area });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete area (and clean up empty slots)
router.delete("/areas/:id", async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Check if any occupied slots exist in this area
    const occupiedSlots = await Slot.find({ area: area.name, isEmpty: false });
    if (occupiedSlots.length > 0) {
      return res.status(400).json({
        message: `Cannot delete area "${area.name}". It has ${occupiedSlots.length} occupied slot(s). Remove products first.`
      });
    }

    // Delete all slots in this area
    await Slot.deleteMany({ area: area.name });

    await Area.findByIdAndDelete(req.params.id);
    res.json({ message: "Area and its empty slots deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Area Name
router.put("/areas/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Area name is required" });
    }

    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Check if new name already exists
    if (area.name !== name) {
      const existingArea = await Area.findOne({ name });
      if (existingArea) {
        return res.status(400).json({ message: "An area with this name already exists" });
      }
    }

    const oldName = area.name;
    area.name = name;
    await area.save();

    // Update all slots that reference this area
    if (oldName !== name) {
      await Slot.updateMany(
        { area: oldName },
        { $set: { area: name } }
      );
    }

    res.json({ message: "Area updated successfully", area });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== SLOT ROUTES ==================

// Create single slot
router.post("/slot", async (req, res) => {
  try {
    const { area, slotId } = req.body;

    // Check if slot already exists
    const existingSlot = await Slot.findOne({ slotId });
    if (existingSlot) {
      return res.status(400).json({ message: "Slot ID already exists" });
    }

    const slot = await Slot.create({
      area,
      slotId,
      isEmpty: true,
      productId: null
    });

    res.json({ message: "Slot created successfully", slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all slots
router.get("/slots", async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get empty slots
router.get("/slots/empty", async (req, res) => {
  try {
    const slots = await Slot.find({ isEmpty: true });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create multiple slots for an area with better naming
// Create multiple slots for an area with better naming
router.post("/slots/bulk", async (req, res) => {
  try {
    const { area, count } = req.body;

    if (!area || !count || count < 1) {
      return res.status(400).json({ message: "Invalid area or count" });
    }

    // Get existing slots for this area to determine starting number
    const existingSlots = await Slot.find({ area });
    const existingNumbers = existingSlots.map(slot => {
      const match = slot.slotId.match(/\d+$/);
      return match ? parseInt(match[0]) : 0;
    });

    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

    // Extract section letter more intelligently
    // Handles: "Section E", "Section-E", "Area-A", "F", etc.
    let sectionLetter = area;

    // Remove common prefixes
    sectionLetter = sectionLetter.replace(/^(Section|Area|Zone)\s*/i, '');
    sectionLetter = sectionLetter.replace(/^(Section|Area|Zone)-*/i, '');
    sectionLetter = sectionLetter.trim();

    // If still has spaces, take last word
    if (sectionLetter.includes(' ')) {
      const parts = sectionLetter.split(' ');
      sectionLetter = parts[parts.length - 1];
    }

    const newSlots = [];
    for (let i = 1; i <= count; i++) {
      const slotNumber = maxNumber + i;
      newSlots.push({
        area,
        slotId: `${sectionLetter}-${slotNumber}`,
        isEmpty: true,
        productId: null
      });
    }

    const createdSlots = await Slot.insertMany(newSlots);
    res.json({
      message: `${createdSlots.length} slots created successfully`,
      slots: createdSlots
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize slots (run once to setup warehouse)
router.post("/setup-slots", async (req, res) => {
  try {
    await Slot.deleteMany({}); // Clear existing slots
    await Area.deleteMany({}); // Clear existing areas

    const slots = [];
    const areas = [];
    const sectionNames = ['A', 'B', 'C', 'D'];

    for (const section of sectionNames) {
      const areaName = `Section ${section}`;
      areas.push({ name: areaName });

      for (let i = 1; i <= 6; i++) {
        slots.push({
          area: areaName,
          slotId: `${section}-${i}`,
          isEmpty: true,
          productId: null
        });
      }
    }

    await Area.insertMany(areas);
    const createdSlots = await Slot.insertMany(slots);
    res.json({
      message: "Slots and areas initialized",
      areas: areas.length,
      slots: createdSlots.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete slot (only if empty)
router.delete("/slots/:id", async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (!slot.isEmpty) {
      return res.status(400).json({
        message: "Cannot delete occupied slot. Remove product first."
      });
    }

    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== PRODUCT ROUTES ==================

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ dateAdded: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by productId
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search product by QR code data (for scanning)
router.post("/products/search", async (req, res) => {
  try {
    const { productId, name, location } = req.body;

    let query = {};
    if (productId) query.productId = productId;
    if (name) query.name = new RegExp(name, 'i');
    if (location) query.slotId = location;

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auto-store product
router.post("/auto-store", async (req, res) => {
  try {
    const emptySlot = await Slot.findOne({ isEmpty: true });

    if (!emptySlot) {
      return res.status(400).json({ message: "No empty slot available" });
    }

    // Update slot
    emptySlot.isEmpty = false;
    emptySlot.productId = req.body.productId;
    await emptySlot.save();

    // Create product
    const product = await Product.create({
      productId: req.body.productId,
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      origin: req.body.origin,
      destination: req.body.destination,
      slotId: emptySlot.slotId,
      photo: req.body.photo,
      qrCode: req.body.qrCode,
      addedBy: req.body.addedBy
    });

    res.json({
      message: "Product stored successfully",
      slotAssigned: emptySlot.slotId,
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve/Delete product
router.post("/retrieve", async (req, res) => {
  try {
    const { productId } = req.body;

    // Find product
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Free the slot
    await Slot.findOneAndUpdate(
      { slotId: product.slotId },
      { isEmpty: true, productId: null }
    );

    // Remove product
    await Product.deleteOne({ productId });

    res.json({
      message: "Product retrieved successfully",
      freedSlot: product.slotId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Free the slot
    await Slot.findOneAndUpdate(
      { slotId: product.slotId },
      { isEmpty: true, productId: null }
    );

    // Delete product
    await Product.deleteOne({ productId: req.params.id });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Add this route to clean up old slots
router.post("/cleanup-slots", async (req, res) => {
  try {
    // Delete all slots with incorrect naming (containing "Section-" in slotId)
    const result = await Slot.deleteMany({
      slotId: { $regex: /^Section-/i }
    });

    res.json({
      message: `Cleaned up ${result.deletedCount} incorrectly named slots`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Custom allocate product to specific slot (Admin only)
router.post("/allocate-custom", async (req, res) => {
  try {
    const { productId, name, description, quantity, origin, destination, photo, qrCode, addedBy, slotId } = req.body;

    // Check if slot exists and is empty
    const slot = await Slot.findOne({ slotId });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (!slot.isEmpty) {
      return res.status(400).json({ message: "Slot is already occupied" });
    }

    // Update slot
    slot.isEmpty = false;
    slot.productId = productId;
    await slot.save();

    // Create product
    const product = await Product.create({
      productId,
      name,
      description,
      quantity,
      origin,
      destination,
      slotId: slot.slotId,
      photo,
      qrCode,
      addedBy
    });

    res.json({
      message: "Product allocated successfully",
      slotAssigned: slot.slotId,
      product
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;