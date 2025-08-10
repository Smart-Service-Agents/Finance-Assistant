import { Conversation } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Retirement Planning',
    messages: [
      {
        id: '1-1',
        content: 'How much should I save for retirement?',
        role: 'user',
        timestamp: new Date('2023-08-15T10:30:00')
      },
      {
        id: '1-2',
        content: 'The general rule of thumb is to save 15% of your pre-tax income for retirement. However, the exact amount depends on your age, current savings, lifestyle, and retirement goals. Would you like me to create a personalized retirement savings plan for you?',
        role: 'assistant',
        timestamp: new Date('2023-08-15T10:30:05')
      }
    ],
    createdAt: new Date('2023-08-15T10:30:00'),
    updatedAt: new Date('2023-08-15T10:30:05')
  },
  {
    id: '2',
    title: 'Investment Strategies',
    messages: [
      {
        id: '2-1',
        content: 'What\'s the best way to start investing with $1000?',
        role: 'user',
        timestamp: new Date('2023-08-14T14:20:00')
      },
      {
        id: '2-2',
        content: 'With $1,000, I recommend starting with a low-cost index fund or ETF that tracks the total stock market. This gives you instant diversification. You can open an account with brokers like Vanguard, Fidelity, or Charles Schwab with no minimum requirements. Would you like specific fund recommendations?',
        role: 'assistant',
        timestamp: new Date('2023-08-14T14:20:10')
      }
    ],
    createdAt: new Date('2023-08-14T14:20:00'),
    updatedAt: new Date('2023-08-14T14:20:10')
  },
  {
    id: '3',
    title: 'Emergency Fund',
    messages: [
      {
        id: '3-1',
        content: 'How much should I have in my emergency fund?',
        role: 'user',
        timestamp: new Date('2023-08-10T09:15:00')
      },
      {
        id: '3-2',
        content: 'Financial experts typically recommend having 3-6 months of essential expenses saved in your emergency fund. This includes housing, food, utilities, transportation, and debt payments. If your income is irregular or you work in an unstable industry, aim for the higher end of that range or even up to 12 months of expenses.',
        role: 'assistant',
        timestamp: new Date('2023-08-10T09:15:08')
      }
    ],
    createdAt: new Date('2023-08-10T09:15:00'),
    updatedAt: new Date('2023-08-10T09:15:08')
  }
];