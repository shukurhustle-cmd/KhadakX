import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async suggestDish(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful restaurant waiter. Recommend dishes based on user preferences.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
      });
      return response.choices[0].message.content || 'Sorry, I could not generate a suggestion.';
    } catch (error) {
      return 'I apologize, but I am unable to provide a recommendation right now.';
    }
  }
}