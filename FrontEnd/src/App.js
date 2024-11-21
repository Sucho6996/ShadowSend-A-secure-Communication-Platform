import React, { useState, useEffect } from 'react';
import './App.css';
import Forms from './Forms';    // Import your Forms component
import MainFeed from './MainFeed';   // Import your MainFeed component
import { useUserContext } from './Context/userContext';

function App() {
  // State to track current view
  const [currentView, setCurrentView] = useState('Forms');  // Default view is 'Forms'

  const { user } = useUserContext(); // Access user context

  // Function to change the view to Main Feed after successful Sign In/Sign Up
  const handleViewSwitch = (view) => {
    setCurrentView(view);
  };

  // Update the view to MainFeed when user is logged in
  useEffect(() => {
    if (user) {
      setCurrentView('MainFeed');
    }
    console.log(user)
  }, [user]); // Only re-run when the user state changes

  return (
    <div className="App">
      {/* Render Forms or MainFeed based on the currentView state */}
      {currentView === 'Forms' && <Forms onViewSwitch={handleViewSwitch} />}
      {currentView === 'MainFeed' && <MainFeed setCurrentView={setCurrentView} />}
    </div>
  );
}

export default App;

