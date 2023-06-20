import { Module } from '@nestjs/common';
import { <%= classify(name) %>Service } from './<%= name %>.service.js';

@Module({
  providers: [<%= classify(name) %>Service],
  exports: [<%= classify(name) %>Service],
})
export class <%= classify(name) %>Module {}
