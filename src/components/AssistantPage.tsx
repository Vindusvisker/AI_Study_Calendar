import React from 'react';
import { MessageSquare, Brain, Clock, Calendar } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="w-12 h-12 bg-[#56C1C7]/10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-[#56C1C7]" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AssistantPage = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Assistant</h1>
        <p className="text-gray-600">Your personal AI-powered study companion</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <FeatureCard
          icon={Brain}
          title="Smart Recommendations"
          description="Get personalized study schedules and task prioritization based on your learning style and goals."
        />
        <FeatureCard
          icon={Clock}
          title="Time Management"
          description="Optimize your study sessions with AI-powered time blocking and break recommendations."
        />
        <FeatureCard
          icon={Calendar}
          title="Schedule Planning"
          description="Automatically organize your calendar with balanced study sessions and breaks."
        />
        <FeatureCard
          icon={MessageSquare}
          title="24/7 Support"
          description="Get instant answers to your questions and motivational support whenever you need it."
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Start a Conversation</h2>
        <p className="text-gray-600 mb-4">Click the assistant button in the bottom right corner to start chatting with your AI study companion.</p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Example questions you can ask:</p>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            <li>• "Help me create a study schedule for my upcoming exam"</li>
            <li>• "What's the best way to organize my tasks for this week?"</li>
            <li>• "I'm feeling overwhelmed, can you help me prioritize?"</li>
            <li>• "Suggest some effective study techniques for mathematics"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;