import React, { useState } from 'react';
import { apiRequest } from '../services/api';
import StatusMessage from './StatusMessage';

function GadgetForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', category: '', condition: 'New', description: '' });
  const [status, setStatus] = useState('');

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const validateForm = () => {
    if (!form.name.trim() || !form.category.trim() || !form.description.trim()) return 'Name, category, and description are required.';
    if (form.name.trim().length < 2 || form.name.trim().length > 60) return 'Name must be between 2 and 60 characters.';
    if (form.category.trim().length < 2 || form.category.trim().length > 40) return 'Category must be between 2 and 40 characters.';
    if (!['New', 'Used', 'Refurbished'].includes(form.condition)) return 'Invalid condition selected.';
    if (form.description.trim().length < 5 || form.description.trim().length > 250) return 'Description must be between 5 and 250 characters.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    const validationError = validateForm();
    if (validationError) {
      setStatus(validationError);
      return;
    }

    try {
      await apiRequest('/api/gadgets', { method: 'POST', body: JSON.stringify(form) });
      setForm({ name: '', category: '', condition: 'New', description: '' });
      setStatus('Gadget created.');
      onCreated();
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <section>
      <h2>Add Gadget</h2>
      <form onSubmit={handleSubmit}>
        <div><label htmlFor="name">Name</label><input id="name" name="name" value={form.name} onChange={updateField} /></div>
        <div><label htmlFor="category">Category</label><input id="category" name="category" value={form.category} onChange={updateField} /></div>
        <div><label htmlFor="condition">Condition</label><select id="condition" name="condition" value={form.condition} onChange={updateField}><option value="New">New</option><option value="Used">Used</option><option value="Refurbished">Refurbished</option></select></div>
        <div><label htmlFor="description">Description</label><textarea id="description" name="description" value={form.description} onChange={updateField} /></div>
        <button type="submit">Create Gadget</button>
      </form>
      <StatusMessage message={status} />
    </section>
  );
}
export default GadgetForm;
