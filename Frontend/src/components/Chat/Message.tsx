import React from 'react';
import { Message as MessageType } from '../../types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: MessageType;
  icon: React.ReactNode;
}

const extractYouTubeID = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
};


const Message: React.FC<MessageProps> = ({ message, icon }) => {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div 
      className={`flex items-start space-x-4 p-4 max-w-4xl mx-auto animate-fade-in`}
    >
      {icon}
      
      <div className="flex-1">
        <div className={`${isAssistant ? 'text-gray-800 dark:text-gray-200' : 'text-gray-800 dark:text-gray-200'} prose dark:prose-invert`}>
          <ReactMarkdown
            components={{
              iframe: ({ ...props }) => (
                <div className="my-4">
                  <iframe
                    {...props}
                    className="w-full max-w-lg h-64 rounded-lg shadow-md"
                    style={{ aspectRatio: '16/9' }}
                  />
                </div>
              ),
            }}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </ReactMarkdown>

          {isAssistant && message.video && extractYouTubeID(message.video) && (
            <div className="my-4">
              <iframe
                className="w-full max-w-lg h-64 rounded-lg shadow-md"
                src={`https://www.youtube.com/embed/${extractYouTubeID(message.video)}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default Message;