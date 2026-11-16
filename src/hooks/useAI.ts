import { useState } from 'react';
import { aiModelService } from '@/services/aiModel';
import BioGPTService from '@/services/bioGPTService';

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
      return {
        text: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        confidence: 0,
        suggestions: []
      };
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (prompt: string): Promise<AIResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to use our API endpoint with BioGPT first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.response || 'I apologize, but I couldn\'t generate a proper response.',
          confidence: 0.95,
          suggestions: [
            'Describe specific symptoms in detail',
            'Ask about medication interactions',
            'Emergency warning signs',
            'When to see a healthcare provider'
          ],
        };
      }
    } catch (err) {
      console.log('API endpoint not available, using BioGPT locally');
    }

    // Fallback to local BioGPT processing
    try {
      const bioGPT = BioGPTService.getInstance();
      const medicalResponse = await bioGPT.generateMedicalResponse(prompt);

      return {
        text: medicalResponse,
        confidence: 0.9,
        suggestions: [
          'Ask about specific symptoms',
          'Medication safety questions',
          'Treatment timeline questions',
          'Follow-up care guidance'
        ],
      };
    } catch (bioGPTError) {
      console.error('BioGPT processing failed:', bioGPTError);
      setError('AI service temporarily unavailable');

      // Professional fallback response
      const fallbackResponse = `SWITCH HEALTH CARE - MEDICAL CONSULTATION

Thank you for your health inquiry regarding: "${prompt}"

ASSESSMENT APPROACH:
Due to technical limitations, I recommend:

IMMEDIATE STEPS:
• Document your symptoms with timing and severity
• Monitor for any changes or worsening
• Consider basic supportive care (rest, hydration)
• Review any current medications for interactions

PROFESSIONAL CONSULTATION:
For proper medical evaluation and personalized treatment recommendations, please:
• Contact your primary care physician
• Visit urgent care for non-emergency concerns
• Call emergency services for severe symptoms

GENERAL WELLNESS:
• Maintain adequate hydration (8-10 glasses daily)
• Ensure sufficient rest (7-9 hours sleep)
• Follow existing treatment plans
• Practice stress management techniques

⚠️ IMPORTANT MEDICAL DISCLAIMER:
This information is for educational purposes only and is NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical advice. For medical emergencies, contact emergency services immediately.`;

      return {
        text: fallbackResponse,
        confidence: 0.7,
        suggestions: [
          'Contact healthcare provider',
          'Visit urgent care facility',
          'Call emergency services if severe',
        ],
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    queryAI,
    generateResponse,
    isLoading,
    error
  };
}
