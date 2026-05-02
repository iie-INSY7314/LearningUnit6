import React from 'react';

function StatusMessage({ message }) {
  if (!message) return null;
  return <p>{message}</p>;
}
export default StatusMessage;
