import { Injectable } from '@nestjs/common';

@Injectable()
export class AIService {
  async suggestDish(prompt: string): Promise<string> {
    // Simple mock response - replace with actual AI later
    return 'I recommend trying our Butter Chicken!';
  }
}