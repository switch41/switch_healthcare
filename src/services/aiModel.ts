const API_URL = 'http://localhost:8001/api';

interface AIResponse {
  text: string;
  confidence: number;
  suggestions: string[];
}

export const aiModelService = {
  async queryModel(message: string): Promise<AIResponse> {
    try {
      console.log('Sending query to AI model:', message);
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('AI model error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`AI model error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received AI response:', data);

      if (!data.response) {
        throw new Error('Invalid response format from AI model');
      }

      return {
        text: data.response,
        confidence: 0.8, // Default confidence for BioGPT
        suggestions: [] // No suggestions for now
      };
    } catch (error) {
      console.error('Error querying AI model:', error);
      throw error;
    }
  },

  async checkModelHealth(): Promise<boolean> {
    try {
      console.log('Checking AI model health...');
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      console.log('Health check response:', data);
      return data.model_ready === true;
    } catch (error) {
      console.error('Error checking model health:', error);
      return false;
    }
  }
}; 