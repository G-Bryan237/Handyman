const express = require('express');
const router = express.Router();
const Service = require('../models/service'); // Changed from './models/Service' to '../models/service'

// Get all services with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { category, active, search, page = 1, limit = 20 } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Service.countDocuments(query);
    
    res.json({
      services,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
    
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
    const serviceData = req.body;
    
    // Validate required fields
    if (!serviceData.name || !serviceData.category || !serviceData.description) {
      return res.status(400).json({ 
        error: 'Name, category, and description are required' 
      });
    }
    
    // Check if service already exists
    const existingService = await Service.findOne({ 
      name: serviceData.name, 
      category: serviceData.category 
    });
    
    if (existingService) {
      return res.status(400).json({ 
        error: 'Service with this name already exists in this category' 
      });
    }
    
    const service = new Service(serviceData);
    const savedService = await service.save();
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: savedService
    });
    
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
    
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get service statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const inactiveServices = await Service.countDocuments({ isActive: false });
    
    // Get services by category
    const servicesByCategory = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      totalServices,
      activeServices,
      inactiveServices,
      servicesByCategory
    });
    
  } catch (error) {
    console.error('Service stats error:', error);
    res.status(500).json({ error: 'Failed to fetch service statistics' });
  }
});

module.exports = router;
