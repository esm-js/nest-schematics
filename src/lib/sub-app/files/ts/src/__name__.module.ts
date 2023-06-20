import { Module } from '@nestjs/common';
import { <%= classify(name) %>Controller } from './<%= name %>.controller.js';
import { <%= classify(name) %>Service } from './<%= name %>.service.js';

@Module({
  imports: [],
  controllers: [<%= classify(name) %>Controller],
  providers: [<%= classify(name) %>Service],
})
export class <%= classify(name) %>Module {}
