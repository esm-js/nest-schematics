import { <%= classify(name) %>Pipe } from './<%= name %>.pipe.js';

describe('<%= classify(name) %>Pipe', () => {
  it('should be defined', () => {
    expect(new <%= classify(name) %>Pipe()).toBeDefined();
  });
});
