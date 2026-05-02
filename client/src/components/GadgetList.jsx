import React from 'react';

function GadgetList({ gadgets, user, onDelete }) {
  if (!gadgets.length) return <p>No gadgets found.</p>;

  return (
    <section>
      <h2>Gadgets</h2>
      <ul>
        {gadgets.map((gadget) => (
          <li key={gadget._id}>
            <strong>{gadget.name}</strong> - {gadget.category} ({gadget.condition})
            {gadget.description && <p>{gadget.description}</p>}
            {user?.role === 'admin' && <button onClick={() => onDelete(gadget._id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
export default GadgetList;
