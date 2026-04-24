require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/texellence-express-v2';

// Basic API Protection Middleware
const adminAuth = (req, res, next) => {
  // Check custom header to act as a simple protected route mechanism for new routes
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader === 'Bearer admin_token') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Admin access required' });
  }
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedData(); // Trigger Seeding
  })
  .catch(err => console.error('MongoDB connection error:', err));

// --- Schemas & Models ---

const Attendance = mongoose.model('Attendance', new mongoose.Schema({
  labour_name: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true }
}, { timestamps: true }));

const salarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Weaver', 'Helper', 'Fitter'], required: true },
  shift: { type: String, required: true },
  monthly_salary: { type: Number, required: true },
  advance_given: { type: Number, required: true },
  net_amount: { type: Number },
  date: { type: String, required: true }
}, { timestamps: true });

salarySchema.pre('save', function() {
  this.net_amount = Number(this.monthly_salary) - Number(this.advance_given);
});
salarySchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update && update.monthly_salary !== undefined && update.advance_given !== undefined) {
    update.net_amount = Number(update.monthly_salary) - Number(update.advance_given);
    this.setUpdate(update);
  }
});

const Salary = mongoose.model('Salary', salarySchema);

const LoomMaintenance = mongoose.model('LoomMaintenance', new mongoose.Schema({
  loom_number: { type: String, required: true },
  issue_description: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Fixed'], required: true }
}, { timestamps: true }));

const Production = mongoose.model('Production', new mongoose.Schema({
  date: { type: String, required: true },
  fabric_type: { type: String, required: true },
  quantity_produced: { type: Number, required: true },
  loom_number: { type: String, required: true },
  shift: { type: String, required: true }
}, { timestamps: true }));

const BeamDelivery = mongoose.model('BeamDelivery', new mongoose.Schema({
  beam_number: { type: String, required: true },
  yarn_type: { type: String, required: true },
  beam_length: { type: Number, required: true },
  delivery_type: { type: String, enum: ['Inward', 'Outward'], required: true },
  loom_number: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true }));

const Sales = mongoose.model('Sales', new mongoose.Schema({
  buyer_name: { type: String, required: true },
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  date: { type: String, required: true }
}, { timestamps: true }));

const Purchase = mongoose.model('Purchase', new mongoose.Schema({
  vendor_name: { type: String, required: true },
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  date: { type: String, required: true }
}, { timestamps: true }));

const PartyDetails = mongoose.model('PartyDetails', new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  gst: { type: String, required: true }
}, { timestamps: true }));

const Delivery = mongoose.model('Delivery', new mongoose.Schema({
  party_name: { type: String, required: true },
  fabric_type: { type: String, required: true },
  quantity: { type: Number, required: true },
  delivery_type: { type: String, enum: ['Inward', 'Outward'], required: true },
  vehicle_number: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true }));

// Object map for easy routing
const modelsMap = {
  'attendance': Attendance,
  'labour': Salary,
  'loom': LoomMaintenance,
  'production': Production,
  'beam': BeamDelivery,
  'sales': Sales,
  'purchase': Purchase,
  'party': PartyDetails,
  'delivery': Delivery
};

// --- API Architecture ---

// Generate generic CRUD routes for all modules
Object.keys(modelsMap).forEach(key => {
  const Model = modelsMap[key];

  // Map GET all with query filters
  app.get(`/api/${key}`, adminAuth, async (req, res) => {
    try {
      const data = await Model.find(req.query).sort({ createdAt: -1 });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Map POST new
  app.post(`/api/${key}`, adminAuth, async (req, res) => {
    try {
      const newDoc = new Model(req.body);
      const savedDoc = await newDoc.save();
      res.status(201).json(savedDoc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Map PUT update
  app.put(`/api/${key}/:id`, adminAuth, async (req, res) => {
    try {
      const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedDoc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Map DELETE
  app.delete(`/api/${key}/:id`, adminAuth, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
});

// --- Seed Data Logic ---
async function seedData() {
  const seeds = {
    'attendance': [
      { labour_name: 'Kumar', date: '2026-03-14', status: 'Present' },
      { labour_name: 'Ravi', date: '2026-03-14', status: 'Absent' }
    ],
    'labour': [
      { name: 'Kumar', role: 'Weaver', shift: 'Day', monthly_salary: 20000, advance_given: 5000, net_amount: 15000, date: '2026-03-01' },
      { name: 'Ravi', role: 'Helper', shift: 'Night', monthly_salary: 15000, advance_given: 2000, net_amount: 13000, date: '2026-03-01' },
      { name: 'Selvam', role: 'Fitter', shift: 'Day', monthly_salary: 25000, advance_given: 0, net_amount: 25000, date: '2026-03-01' }
    ],
    'loom': [
      { loom_number: 'LM-001', issue_description: 'Motor bearing noise', date: '2026-03-12', status: 'Pending' },
      { loom_number: 'LM-005', issue_description: 'Weft breakage sensor failure', date: '2026-03-10', status: 'Fixed' }
    ],
    'production': [
      { date: '2026-03-14', fabric_type: 'Cotton 40s', quantity_produced: 1200, loom_number: 'LM-001', shift: 'Day' },
      { date: '2026-03-14', fabric_type: 'Polyester Blend', quantity_produced: 1800, loom_number: 'LM-002', shift: 'Night' }
    ],
    'beam': [
      { beam_number: 'B-105', yarn_type: 'Cotton', beam_length: 5000, delivery_type: 'Inward', loom_number: 'LM-001', date: '2026-03-13' },
      { beam_number: 'B-106', yarn_type: 'Polyester', beam_length: 4500, delivery_type: 'Outward', loom_number: 'LM-003', date: '2026-03-14' }
    ],
    'sales': [
      { buyer_name: 'Reliance Textiles', item_name: 'Processed Fabric', quantity: 5000, rate: 120, date: '2026-03-10' },
      { buyer_name: 'Aditya Birla', item_name: 'Grey Fabric', quantity: 3000, rate: 80, date: '2026-03-12' }
    ],
    'purchase': [
      { vendor_name: 'Vardhman Yarns', item_name: 'Cotton Yarn 40s', quantity: 2000, rate: 250, date: '2026-03-11' },
      { vendor_name: 'Trident Group', item_name: 'Spandex Yarn', quantity: 500, rate: 400, date: '2026-03-13' }
    ],
    'party': [
      { name: 'Senthil Textiles', contact: 'Mr. Senthil', address: 'Tiruppur, TN', gst: '33AAACB1234C1Z5' },
      { name: 'Kumar Traders', contact: 'Mr. Kumar', address: 'Erode, TN', gst: '33AABBC5678D1Z2' }
    ],
    'delivery': [
      { party_name: 'Senthil Textiles', fabric_type: 'Grey Fabric', quantity: 900, delivery_type: 'Outward', vehicle_number: 'TN38 AB 4521', date: '2026-03-14' },
      { party_name: 'Kumar Traders', fabric_type: 'Processed Fabric', quantity: 650, delivery_type: 'Inward', vehicle_number: 'TN37 CD 9812', date: '2026-03-14' }
    ]
  };

  try {
    for (const key of Object.keys(modelsMap)) {
      const count = await modelsMap[key].countDocuments();
      if (count === 0 && seeds[key]) {
        await modelsMap[key].insertMany(seeds[key]);
        console.log(`Seeded 2 records into ${key} collection.`);
      }
    }
  } catch(e) {
    console.error("Seeding Error:", e);
  }
}

app.listen(PORT, () => {
  console.log(`Texellence Server running on http://localhost:${PORT}`);
});
