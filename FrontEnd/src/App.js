import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Css/App.css';
import { useUserContext } from './Context/userContext';

// Lazy load components
const Forms = lazy(() => import('./MainPages/Forms'));
const MainFeed = lazy(() => import('./MainPages/MainFeed'));

function App() {
  const { user } = useUserContext();

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/mainfeed" /> : <Forms />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/mainfeed" element={user ? <MainFeed /> : <Navigate to="/forms" />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default React.memo(App);
