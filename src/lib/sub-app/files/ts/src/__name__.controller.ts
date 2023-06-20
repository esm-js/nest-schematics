import { Controller, Get } from '@nestjs/common';
import { <%= classify(name) %>Service } from './<%= name %>.service.js';

@Controller()
export class <%= classify(name) %>Controller {
  constructor(private readonly <%= camelize(name) %>Service: <%= classify(name) %>Service) {}

  @Get()
  getHello(): string {
    return this.<%= camelize(name) %>Service.getHello();
  }
}
