const validateGadget = require('../utils/validateGadget');

describe('validateGadget', () => {
  test('returns empty string for valid input', () => {
    const result = validateGadget({
      name: 'Smart Plug',
      category: 'Home Automation',
      condition: 'New',
      description: 'A plug that can be controlled from a mobile app.'
    });
    expect(result).toBe('');
  });

  test('returns error when a field is missing', () => {
    const result = validateGadget({ name: 'Smart Plug', category: 'Home Automation', condition: 'New' });
    expect(result).toBe('All fields are required');
  });

  test('returns error when description is not text', () => {
    const result = validateGadget({ name: 'Smart Plug', category: 'Home Automation', condition: 'New', description: 123 });
    expect(result).toBe('All fields must be text values');
  });

  test('returns error for invalid condition', () => {
    const result = validateGadget({ name: 'Smart Plug', category: 'Home Automation', condition: 'Broken', description: 'A plug that can be controlled from a mobile app.' });
    expect(result).toBe('Condition must be New, Used, or Refurbished');
  });
});
