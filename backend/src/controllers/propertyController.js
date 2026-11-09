import Property from '../models/Property.js';
import { uploadToImageKit } from '../middleware/upload.js';

// 1. Get all properties (with filters)
export const getProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bhk } = req.query;
    let query = {};
    
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (type) query.type = type;
    
    // Fix: If bhk is selected, use $gte (greater than or equal to) instead of exact match
    if (bhk) query.bhk = { $gte: Number(bhk) }; 
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query).populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};
// ADD THIS NEW DELETE FUNCTION at the bottom of the file
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Check if the logged-in user is the owner
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get a single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

// 3. Create a new property (with Image Upload)
export const createProperty = async (req, res) => {
  try {
    const { title, description, price, type, bhk, area, city, state, address } = req.body;
    
    // Check for images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload images to ImageKit (or use the mock if keys are missing)
    const images = await Promise.all(req.files.map(file => uploadToImageKit(file)));

    // Create property in MongoDB
    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      price: Number(price),
      type,
      bhk: Number(bhk),
      area: Number(area),
      location: { city, state, address },
      images,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("🔥 Error creating property:", error);
    res.status(500).json({ message: error.message || 'Server Error creating property' });
  }
};

// 4. Get properties belonging to the logged-in user
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your properties', error: error.message });
  }
};