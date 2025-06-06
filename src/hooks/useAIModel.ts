import { useState } from 'react';
import { aiModelService } from '@/services/aiModel';
import { useToast } from '@/components/ui/use-toast';

export const useAIModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const queryModel = async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Querying model with message:', message);
      const response = await aiModelService.queryModel(message);
      console.log('Received response:', response);
      return response.text; // Return the text field from the response
    } catch (err) {
      console.error('Error in useAIModel:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkModelHealth = async () => {
    try {
      return await aiModelService.checkModelHealth();
    } catch (err) {
      console.error('Model health check failed:', err);
      return false;
    }
  };

  return {
    queryModel,
    checkModelHealth,
    isLoading,
    error,
  };
}; 