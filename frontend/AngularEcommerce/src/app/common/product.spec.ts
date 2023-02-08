import { Product } from './product';

describe('Product', () => {
  it('should create an instance', () => {
    // @ts-ignore
    expect(new Product()).toBeTruthy();
  });
});
