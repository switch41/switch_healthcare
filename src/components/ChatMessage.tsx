
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={cn(
      "chat-message mb-4 p-3 rounded-lg",
      isUser ? "bg-medical-primary/10 ml-8" : "bg-gray-100 mr-8"
    )}>
      <div className="flex items-start gap-3">
        {!isUser && (
          <div className="flex-shrink-0 bg-medical-light rounded-full p-1">
            <Bot className="h-5 w-5 text-medical-primary" />
          </div>
        )}
        <div className="flex-1">
          <div className="font-medium text-sm mb-1">
            {isUser ? 'You' : 'MediAssist'}
          </div>
          <div className="text-sm">{message.content}</div>
        </div>
        {isUser && (
          <div className="flex-shrink-0 bg-medical-primary/20 rounded-full p-1">
            <User className="h-5 w-5 text-medical-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
