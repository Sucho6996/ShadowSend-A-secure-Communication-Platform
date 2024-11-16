import React, { useState } from 'react';
import './App.css';
import Forms from './Forms';    // Import your Forms component
import MainFeed from './MainFeed';   // Import your MainFeed component
import  Toaster  from 'react-hot-toast';

function App() {
  // State to track current view
  const [currentView, setCurrentView] = useState('Forms');  // Default view is 'Forms'

  // Function to change the view to Main Feed after successful Sign In/Sign Up
  const handleViewSwitch = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="App">
      
      {/* Render Forms or MainFeed based on the currentView state */}
      {currentView === 'Forms' && <Forms onViewSwitch={handleViewSwitch} />}
      {currentView === 'MainFeed' && <MainFeed />}
    </div>
  );
}

export default App;
