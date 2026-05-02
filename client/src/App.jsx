import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { clearAuth, getSavedUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getSavedUser();
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <main>
      <h1>SecureAPI Client</h1>
      {!user && <LoginForm onLogin={setUser} />}
      {user && (
        <section>
          <h2>Welcome</h2>
          <p>Logged in as: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
          <Dashboard user={user} />
        </section>
      )}
    </main>
  );
}
export default App;
