import { <%= classify(name) %>Guard } from './<%= name %>.guard.js';

describe('<%= classify(name) %>Guard', () => {
  it('should be defined', () => {
    expect(new <%= classify(name) %>Guard()).toBeDefined();
  });
});
