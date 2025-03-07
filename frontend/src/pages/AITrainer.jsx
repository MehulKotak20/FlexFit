import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User, Info, Dumbbell, MessageSquare } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AITrainer = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage = {
        id: '1',
        sender: 'ai',
        text: `Hello ${user.name}! I'm your AI personal trainer. How can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
     
    try {
      const response = await axios.post("http://localhost:5000/api/chatbot/ask", {
        question: {input},
        height: user.height,
        weight: user.weight
      });
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.data.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: 'Sorry, something went wrong. Please try again.', timestamp: new Date() }]);
    }
    setIsTyping(false);
  };

  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Personal Trainer</h1>
        <p className="text-gray-600">Your virtual fitness coach is here to help.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow flex flex-col h-[600px]">
            <div className="bg-indigo-600 text-white p-4 flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <h2 className="font-semibold">FitTrack AI Trainer</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <div className="text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                         {message.text}
                        </ReactMarkdown>
                         </div>

                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800">Typing...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <div className="flex items-center">
                <textarea
                  value={ input }
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your AI trainer a question..."
                  className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none"
                  rows={1}
                ></textarea>
                <button
                  onClick={handleSendMessage}
                  disabled={input.trim() === ''}
                  className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-semibold">Your Stats</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">{user.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{user.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BMI:</span>
                        <span className="font-medium">{parseFloat((user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Goal:</span>
                        <span className="font-medium capitalize">{user.goal}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center mb-3">
                      <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-semibold">Suggested Questions</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => setInput("What's the best workout for my goals?")}
                        className="w-full text-left text-sm p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        What's the best workout for my goals?
                      </button>
                      <button 
                        onClick={() => setInput("How can I improve my diet?")}
                        className="w-full text-left text-sm p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        How can I improve my diet?
                      </button>
                      <button 
                        onClick={() => setInput("I'm struggling with motivation. Any tips?")}
                        className="w-full text-left text-sm p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        I'm struggling with motivation. Any tips?
                      </button>
                      <button 
                        onClick={() => setInput("How can I track my progress effectively?")}
                        className="w-full text-left text-sm p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        How can I track my progress effectively?
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center mb-3">
                      <Dumbbell className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-semibold">Quick Actions</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-md text-sm font-medium">
                        Start Workout
                      </button>
                      <button className="bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-md text-sm font-medium">
                        Log Meal
                      </button>
                      <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-md text-sm font-medium">
                        Update Weight
                      </button>
                      <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-2 rounded-md text-sm font-medium">
                        Set New Goal
                      </button>
                    </div>
                  </div>
                </div>
      </div>
    </div>
  );
};

export default AITrainer;
