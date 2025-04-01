// src/App.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Login from './Login';
import StockSearch from './StockSearch';
import Portfolio from './Portfolio';
import SignOut from './SignOut';
import DeleteAccount from './DeleteAccount';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // If no user is logged in, show the login page
  if (!user) {
    return (
      <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to Investor Practice</h1>
        <Login />
      </div>
    );
  }

  // When a user is logged in, show the main app layout
  return (
    <div className="App">
      {/* Header with title and action buttons on the top right */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px',
          borderBottom: '1px solid #ccc',
        }}
      >
        <h1>Welcome to Investor Practice</h1>
        <div>
          <SignOut />
          <DeleteAccount />
        </div>
      </header>

      {/* Main content area with two columns */}
      <div style={{ display: 'flex', padding: '20px' }}>
        {/* Left column: Stock Search & Buy */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <StockSearch />
        </div>
        {/* Right column: Portfolio */}
        <div style={{ flex: 1 }}>
          <Portfolio />
        </div>
      </div>
    </div>
  );
}

export default App;