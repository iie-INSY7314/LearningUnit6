const allowedConditions = ['New', 'Used', 'Refurbished'];

const validateGadget = (input) => {
  if (!input) {
    return 'Input is required';
  }

  const { name, category, condition, description } = input;

  if (!name || !category || !condition || !description) {
    return 'All fields are required';
  }

  if (
    typeof name !== 'string' ||
    typeof category !== 'string' ||
    typeof condition !== 'string' ||
    typeof description !== 'string'
  ) {
    return 'All fields must be text values';
  }

  if (name.trim().length < 2 || name.trim().length > 60) {
    return 'Name must be between 2 and 60 characters';
  }
  if (category.trim().length < 2 || category.trim().length > 40) {
    return 'Category must be between 2 and 40 characters';
  }
  if (!allowedConditions.includes(condition.trim())) {
    return 'Condition must be New, Used, or Refurbished';
  }
  if (description.trim().length < 5 || description.trim().length > 250) {
    return 'Description must be between 5 and 250 characters';
  }

  return '';
};

module.exports = validateGadget;
