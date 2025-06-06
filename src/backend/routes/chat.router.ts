import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { ChatService } from '../services/chat.service.js';

const router = Router();
const chatService = new ChatService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      res.status(400).json({ 
        error: 'Message is required',
        details: 'Please provide a message in the request body'
      });
      return;
    }

    const aiResponse = await chatService.generateResponse(message);
    
    res.status(200).json({ response: aiResponse });
    
  } catch (error) {
    logger.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const chats = await chatService.getAll();
    res.status(200).json(chats);
  } catch (error) {
    logger.error('Error fetching chats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chats',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const chat = await chatService.getById(req.params.id);
    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }
    res.status(200).json(chat);
  } catch (error) {
    logger.error('Error fetching chat:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;
