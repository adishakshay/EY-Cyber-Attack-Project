import React, { useState } from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AttackSimulator } from './components/AttackSimulator';
import { DatabaseViewer } from './components/DatabaseViewer';
import { Timeline } from './components/Timeline';
import { Login } from './components/Login';
import './App.css';

const AppContent: React.FC = () => {
  const { isLoggedIn } = useSecurity();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <div className="cyber-bg"></div>
      
      {/* Sidebar Admin Menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Panel Content Area */}
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'simulator' && <AttackSimulator />}
        {activeTab === 'database' && <DatabaseViewer />}
        {activeTab === 'timeline' && <Timeline />}
      </div>
    </div>
  );
};

function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}

export default App;
