import React, { useState, useEffect } from 'react';
import { Bot, X, MessageSquare, GripHorizontal } from 'lucide-react';

export function ExoBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([
    { role: 'bot', text: 'Hi! I am ExoBot. I can help guide you through Exo Domain. What do you need help with?' }
  ]);
  const [input, setInput] = useState('');

  // Draggable State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    // Don't call preventDefault here if it blocks input focus inside the chat box,
    // but on the drag handles we definitely can.
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      if (Math.abs(dx - position.x) > 4 || Math.abs(dy - position.y) > 4) {
        setHasMoved(true);
      }
      setPosition({ x: dx, y: dy });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  const handleLauncherClick = () => {
    if (!hasMoved) {
      setIsOpen(!isOpen);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    
    // Simple mock responses
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'I am a beta assistant. For now, try exploring the Marketplace or checking your Profile Dashboard for KYC and Subscription plans.'
      }]);
    }, 1000);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
      }}
    >
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 mb-4 overflow-hidden flex flex-col h-96">
          {/* Header serves as drag handle */}
          <div 
            onMouseDown={handleMouseDown}
            className="bg-gray-900 text-white p-4 flex justify-between items-center cursor-move active:bg-gray-850"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">ExoBot Helper</span>
                <span className="text-[9px] text-gray-400">Drag me anywhere</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-gray-500" />
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask ExoBot..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
            />
            <button type="submit" className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800">
              <MessageSquare className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
      
      {/* Draggable launcher button */}
      <button 
        onMouseDown={handleMouseDown}
        onClick={handleLauncherClick}
        title="Drag to reposition, Click to chat"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 ${
          isDragging ? 'bg-teal-600 cursor-grabbing' : 'bg-gray-900 cursor-grab hover:bg-gray-800'
        }`}
      >
        <Bot className="w-6 h-6 text-teal-400" />
      </button>
    </div>
  );
}
