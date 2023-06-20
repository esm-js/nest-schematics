import { <%= classify(className) %> } from './<%= name %>.js';

describe('<%= classify(className) %>', () => {
  it('should be defined', () => {
    expect(new <%= classify(className) %>()).toBeDefined();
  });
});
