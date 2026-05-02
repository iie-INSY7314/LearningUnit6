import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import GadgetForm from './GadgetForm';
import GadgetList from './GadgetList';
import StatusMessage from './StatusMessage';

function Dashboard({ user }) {
  const [gadgets, setGadgets] = useState([]);
  const [status, setStatus] = useState('');

  const loadGadgets = async () => {
    try {
      setStatus('Loading gadgets...');
      const data = await apiRequest('/api/gadgets');
      setGadgets(data.data || []);
      setStatus('');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const deleteGadget = async (id) => {
    try {
      await apiRequest(`/api/gadgets/${id}`, { method: 'DELETE' });
      setStatus('Gadget deleted.');
      loadGadgets();
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => { loadGadgets(); }, []);

  return (
    <section>
      <h2>Dashboard</h2>
      <StatusMessage message={status} />
      <GadgetForm onCreated={loadGadgets} />
      <GadgetList gadgets={gadgets} user={user} onDelete={deleteGadget} />
    </section>
  );
}
export default Dashboard;
