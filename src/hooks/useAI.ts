import { useState } from 'react';
import { aiModelService } from '@/services/aiModel';

interface AIResponse {
  text: string;
  confidence: number;
  suggestions: string[];
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryAI = async (message: string): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Querying AI with message:', message);
      const response = await aiModelService.queryModel(message);
      console.log('AI response received:', response);
      return response;
    } catch (err) {
      console.error('Error in useAI hook:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      // Return a fallback response
      return {
        text: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        confidence: 0,
        suggestions: []
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    queryAI,
    isLoading,
    error
  };
}
