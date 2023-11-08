import { Module } from '@nestjs/common';
import { <%= classify(name) %>Service } from './<%= name %>.service.js';
<% if (type === 'rest' || type === 'microservice') { %>import { <%= classify(name) %>Controller } from './<%= name %>.controller.js';<% } %><% if (type === 'graphql-code-first' || type === 'graphql-schema-first') { %>import { <%= classify(name) %>Resolver } from './<%= name %>.resolver.js';<% } %><% if (type === 'ws') { %>import { <%= classify(name) %>Gateway } from './<%= name %>.gateway.js';<% } %>

@Module({
  <% if (type === 'rest' || type === 'microservice') { %>controllers: [<%= classify(name) %>Controller],
  providers: [<%= classify(name) %> Service], <% } else if (type === 'graphql-code-first' || type === 'graphql-schema-first') { %> providers: [<%= classify(name) %> Resolver, <%= classify(name) %> Service], <% } else { %> providers: [<%= classify(name) %> Gateway, <%= classify(name) %> Service], <% } %>
})
export class <%= classify(name) %>Module {}
