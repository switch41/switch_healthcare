import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import axios from 'axios';
import { config } from '../config/index.js';
import { supabase } from '../../integrations/supabase/client.js';
import { HfInference } from '@huggingface/inference';

// System prompt for medical assistant
const SYSTEM_PROMPT = `You are MediAssist, a healthcare assistant. Your role is to:
1. Assess patient symptoms and concerns
2. Provide evidence-based medical information
3. Triage cases based on severity
4. Guide patients through self-care when appropriate
5. Escalate to human providers when necessary

Always:
- Maintain patient privacy and confidentiality
- Be clear about your limitations
- Recommend professional medical care for serious conditions
- Document all interactions for medical records
- Follow established medical protocols`;

export class ChatService {
  private hf: HfInference;
  private readonly MODEL_ID = "ContactDoctor/Bio-Medical-Llama-3-8B";
  private readonly API_URL = 'http://localhost:8000/api';

  constructor() {
    this.hf = new HfInference(config.huggingfaceApiKey);
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await axios.post(`${this.API_URL}/chat`, {
        message
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      if (!response.data || !response.data.response) {
        throw new Error('Invalid response format from API');
      }

      return response.data.response;
    } catch (error) {
      logger.error('Error generating response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async getAll(): Promise<any[]> {
    // Implement if needed
    return [];
  }

  async getById(id: string): Promise<any> {
    // Implement if needed
    return null;
  }

  async update(id: string, data: any): Promise<any> {
    // Implement if needed
    return null;
  }

  async delete(id: string): Promise<void> {
    // Implement if needed
  }

  // Create a new chat
  async createChat(data: { patientId: string, type: string }): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/chat`, {
        patientId: data.patientId,
        type: data.type
      });

      return response.data;
    } catch (error) {
      logger.error('Error creating chat:', error);
      throw new Error('Failed to create chat');
    }
  }

  // Get chat by ID
  async getChatById(id: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}/chat/${id}`);
      return response.data;
    } catch (error) {
      logger.error('Error getting chat:', error);
      throw new Error('Failed to get chat');
    }
  }

  // Add message to chat
  async addMessage(chatId: string, message: { content: string, role: string, userId: string }): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}/chat/${chatId}/message`, {
        content: message.content,
        role: message.role,
        userId: message.userId
      });

      return response.data;
    } catch (error) {
      logger.error('Error adding message:', error);
      throw new Error('Failed to add message');
    }
  }

  // Get chat history for a patient
  async getPatientHistory(patientId: string, filters: any = {}): Promise<any[]> {
    try {
      let query = supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', patientId)
        .order('timestamp', { ascending: false });

      if (filters.type) {
        query = query.eq('message_type', filters.type);
      }

      const { data: chats, error } = await query;
      if (error) throw error;
      return chats || [];
    } catch (error) {
      logger.error('Error getting patient history:', error);
      throw error;
    }
  }

  // Get chats by type
  async getChatsByType(type: string, filters: any = {}): Promise<any[]> {
    try {
      const { data: chats, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('message_type', type)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return chats || [];
    } catch (error) {
      logger.error('Error getting chats by type:', error);
      throw error;
    }
  }

  // Get chat analytics for a patient
  async getPatientAnalytics(patientId: string, startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const { data: chats, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', patientId)
        .eq('message_type', 'text')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      if (!chats) return { dailyStats: [], totalChats: 0, totalMessages: 0, avgResponseTime: 0 };

      const dailyStats: Record<string, { count: number; messageCount: number; avgResponseTime: number }> = {};
      let totalMessages = 0;
      let totalResponseTime = 0;

      chats.forEach((chat: any) => {
        const date = chat.timestamp.split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = {
            count: 0,
            messageCount: 0,
            avgResponseTime: 0
          };
        }
        dailyStats[date].count += 1;
        dailyStats[date].messageCount += 1;
        totalMessages += 1;

        const time = new Date(chat.timestamp);
        if (chat.sender === 'assistant') {
          const prevChat = chats.find((c: any) => 
            c.sender === 'user' && 
            new Date(c.timestamp) < time
          );
          if (prevChat) {
            const responseTime = time.getTime() - new Date(prevChat.timestamp).getTime();
            dailyStats[date].avgResponseTime += responseTime;
            totalResponseTime += responseTime;
          }
        }
      });

      // Calculate averages
      Object.values(dailyStats).forEach(stats => {
        if (stats.messageCount > 0) {
          stats.avgResponseTime = stats.avgResponseTime / stats.messageCount;
        }
      });

      return {
        dailyStats: Object.entries(dailyStats).map(([date, stats]) => ({
          date,
          count: stats.count,
          messageCount: stats.messageCount,
          avgResponseTime: stats.avgResponseTime
        })),
        totalChats: Object.keys(dailyStats).length,
        totalMessages,
        avgResponseTime: totalMessages > 0 ? totalResponseTime / totalMessages : 0
      };
    } catch (error) {
      logger.error('Error getting patient analytics:', error);
      throw error;
    }
  }

  // Generate AI response using Hugging Face API
  private async generateAIResponse(messages: { content: string, role: string }[]): Promise<{ content: string }> {
    try {
      // Format messages for the model
      const formattedMessages = messages
        .filter(msg => msg.role !== 'provider')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        }));

      // Prepare the prompt
      const prompt = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...formattedMessages,
      ].map(msg => `${msg.role}: ${msg.content}`).join('\n');

      logger.info('Sending request to Hugging Face API:', {
        endpoint: config.medAlpacaEndpoint,
        promptLength: prompt.length,
        hasApiKey: !!config.huggingfaceApiKey
      });

      // Call Hugging Face API
      const response = await axios.post(
        config.medAlpacaEndpoint,
        { inputs: prompt },
        {
          headers: {
            'Authorization': `Bearer ${config.huggingfaceApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      logger.info('Received response from Hugging Face API:', {
        status: response.status,
        hasData: !!response.data,
        responseLength: response.data?.[0]?.generated_text?.length
      });

      if (!response.data || !response.data[0]?.generated_text) {
        throw new Error('Invalid response format from Hugging Face API');
      }

      const aiResponse = response.data[0].generated_text;
      
      return {
        content: aiResponse,
      };
    } catch (error: any) {
      logger.error('AI response generation failed:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        endpoint: config.medAlpacaEndpoint
      });
      
      // Return a fallback response if the API call fails
      return {
        content: "I apologize, but I'm having trouble connecting to my medical knowledge base right now. Please try again in a moment or contact your healthcare provider for immediate assistance."
      };
    }
  }
} 