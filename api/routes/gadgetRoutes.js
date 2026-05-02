const express = require('express');
const router = express.Router();

const {
  getAllGadgets,
  getGadgetById,
  createGadget,
  updateGadget,
  deleteGadget
} = require('../controllers/gadgetController');

const validateGadgetInput = require('../middleware/validateGadgetInput');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getAllGadgets);
router.get('/:id', getGadgetById);
router.post('/', protect, validateGadgetInput, createGadget);
router.put('/:id', protect, validateGadgetInput, updateGadget);
router.delete('/:id', protect, authorizeRoles('admin'), deleteGadget);

module.exports = router;
