import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import './Css/App.css';
import { useUserContext } from './Context/userContext';

// Lazy load components
const Forms = lazy(() => import('./MainPages/Forms'));
const MainFeed = lazy(() => import('./MainPages/MainFeed'));

function App() {
  const [currentView, setCurrentView] = useState('Forms');
  const { user } = useUserContext();

  const derivedView = useMemo(() => (user ? 'MainFeed' : 'Forms'), [user]);

  useEffect(() => {
    setCurrentView(derivedView);
    console.log(user);
  }, [derivedView]);

  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        {currentView === 'Forms' && <Forms onViewSwitch={setCurrentView} />}
        {currentView === 'MainFeed' && <MainFeed setCurrentView={setCurrentView} />}
      </Suspense>
    </div>
  );
}

export default React.memo(App);
