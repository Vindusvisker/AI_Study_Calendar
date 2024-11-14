import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Cloud, ArrowRight } from 'lucide-react';
import { useDataMode } from '../context/DataModeContext';

const DataModeSelection = () => {
  const navigate = useNavigate();
  const { setDataMode } = useDataMode();

  const handleModeSelection = (mode: 'sample' | 'real') => {
    setDataMode(mode);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Choose Your Data Mode
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sample Data Mode */}
          <button
            onClick={() => handleModeSelection('sample')}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Sample Data Mode</h2>
            <p className="text-gray-600 mb-4">
              Explore the app with pre-populated sample data. Perfect for testing features
              without connecting to Google Calendar.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                No login required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Instant access to all features
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Sample tasks and events
              </div>
            </div>
          </button>

          {/* Real Data Mode */}
          <button
            onClick={() => handleModeSelection('real')}
            className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Google Calendar Mode</h2>
            <p className="text-gray-600 mb-4">
              Connect with Google Calendar to use your real schedule and events.
              Sync across all your devices.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Real-time calendar sync
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Personal calendar data
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                Cross-device synchronization
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataModeSelection;