const mongoose = require('mongoose');
const Gadget = require('../models/Gadget');

const getAllGadgets = async (req, res, next) => {
  try {
    const gadgets = await Gadget.find().select('name category condition description createdAt').sort({ createdAt: -1 });
    res.status(200).json({ count: gadgets.length, data: gadgets });
  } catch (error) {
    next(error);
  }
};

const getGadgetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid gadget ID format' });
    }
    const gadget = await Gadget.findById(id);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }
    res.status(200).json({ data: gadget });
  } catch (error) {
    next(error);
  }
};

const createGadget = async (req, res, next) => {
  try {
    const gadget = await Gadget.create({ ...req.body, owner: req.user ? req.user.id : undefined });
    res.status(201).json({ message: 'Gadget created', data: gadget });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const updateGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid gadget ID format' });
    }
    const gadget = await Gadget.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }
    res.status(200).json({ message: 'Gadget updated', data: gadget });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

const deleteGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid gadget ID format' });
    }
    const gadget = await Gadget.findByIdAndDelete(id);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }
    res.status(200).json({ message: 'Gadget deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllGadgets, getGadgetById, createGadget, updateGadget, deleteGadget };
