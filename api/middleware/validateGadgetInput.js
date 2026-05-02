const validateGadget = require('../utils/validateGadget');

const validateGadgetInput = (req, res, next) => {
  const error = validateGadget(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  req.body = {
    name: req.body.name.trim(),
    category: req.body.category.trim(),
    condition: req.body.condition.trim(),
    description: req.body.description.trim()
  };

  next();
};

module.exports = validateGadgetInput;
