import {deepGet} from '../helper';

describe('Helpers', () => {
  describe('deepGet', () => {
    it('should return nested property', () => {
      const obj = {a: {b: {c: {d: {e: 100}}}}};
      const value = deepGet(obj, ['a', 'b', 'c', 'd', 'e']);
      expect(value).toBe(100);
    });

    it('should return empty object when not found', () => {
      const obj = {a: {b: {c: {d: {e: 100}}}}};
      const value = deepGet(<any>obj, ['a', 'b', 'f', 'x', 'z']);
      expect(value).toEqual({});
    });

    it('should throw up when not found and configured to do so', () => {
      const obj = {a: {b: {c: {d: {e: 100}}}}};
      expect(() => deepGet(<any>obj, ['a', 'b', 'f', 'x', 'z'], true)).toThrow();
    });
  });
});
