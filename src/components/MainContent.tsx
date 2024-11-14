import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import PlannerPage from './planner/PlannerPage';
import AssistantPage from './AssistantPage';

const MainContent = () => {
  return (
    <main className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
      </Routes>
    </main>
  );
}

export default MainContent;