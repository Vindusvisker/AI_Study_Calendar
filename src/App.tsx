import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Assistant from './components/Assistant';
import DataModeSelection from './components/DataModeSelection';
import { AuthProvider } from './components/AuthProvider';
import { DataModeProvider, useDataMode } from './context/DataModeContext';

const AppLayout = () => {
  const { dataMode } = useDataMode();

  // If no mode is selected, redirect to mode selection
  if (!dataMode) {
    return <Navigate to="/select-mode" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MainContent />
      <Assistant />
    </div>
  );
};

function App() {
  return (
    <DataModeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/select-mode" element={<DataModeSelection />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </DataModeProvider>
  );
}

export default App;