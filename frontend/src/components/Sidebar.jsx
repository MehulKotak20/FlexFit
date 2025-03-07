import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Apple, 
  Scale,
  LineChart, 
  Bot
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/exercises", icon: <Dumbbell size={20} />, label: "Exercises" },
    { path: "/nutrition", icon: <Apple size={20} />, label: "Nutrition" },
    { path: "/bmi", icon: <Scale size={20} />, label: "BMI Calculator" },
    { path: "/progress", icon: <LineChart size={20} />, label: "Progress" },
    { path: "/ai-trainer", icon: <Bot size={20} />, label: "AI Trainer" },
    {
      path: "http://localhost:3000/video-streaming",
      icon: <Bot size={20} />,
      label: "Excercise Assessment",
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive(item.path)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-800">Need help?</h3>
            <p className="mt-1 text-xs text-indigo-600">
              Ask your AI trainer for personalized advice and workout tips.
            </p>
            <Link
              to="/ai-trainer"
              className="mt-3 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Bot size={16} className="mr-2" />
              Chat with AI Trainer
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
