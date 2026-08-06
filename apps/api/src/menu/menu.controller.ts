import { Controller, Get } from '@nestjs/common';

@Controller('menu')
export class MenuController {
  @Get('demo')
  async getDemoMenu() {
    return [
      { id: '1', name: 'Butter Chicken', price: 450, category: 'Main Course' },
      { id: '2', name: 'Paneer Tikka', price: 350, category: 'Starters' },
      { id: '3', name: 'Garlic Naan', price: 80, category: 'Breads' },
      { id: '4', name: 'Mango Lassi', price: 120, category: 'Beverages' },
    ];
  }
}