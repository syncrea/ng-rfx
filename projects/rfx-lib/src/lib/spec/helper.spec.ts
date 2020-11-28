import {
  deepGet,
  extractErrorsWithAliasPrefix,
  getAliasFromControl,
  getMapper,
  toBoolean,
  toBooleanArray,
  toNumber,
  toNumberArray,
  toString,
  toStringArray
} from '../helper';
import { TypedFormControl } from '../forms/typed-form-control';
import { createForm } from '../forms/form-creation';
import { FormDefinitionInfer } from '../model';

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

  describe('formControl error path alias prefixes', () => {
    it('should get alias correctly when present', () => {
      const control = new TypedFormControl<number>(1, undefined, undefined, {
        type: 'Field',
        initialValue: 1,
        alias: 'numberField'
      });
      expect(getAliasFromControl(control)).toEqual(['numberField']);
    });

    it('should get errors with root alias', () => {
      const formDefinition: FormDefinitionInfer<{
        a: string;
        b: {
          c: string;
          d: {
            e: string;
          }
        }
      }> = {
        type: 'Group',
        alias: 'root',
        fields: {
          a: 'A',
          b: {
            type: 'Group',
            fields: {
              c: 'C',
              d: {
                type: 'Group',
                fields: {
                  e: 'E'
                }
              }
            }
          }
        }
      };

      const form = createForm(formDefinition);
      form.typedControls.b.typedControls.c.setErrors({required: true});

      expect(extractErrorsWithAliasPrefix(form.typedControls.b.typedControls.c)).toEqual({'root.required': true});
    });

    it('should get errors with complex alias path', () => {
      const formDefinition: FormDefinitionInfer<{
        a: string;
        b: {
          c: string;
          d: {
            e: string;
          }
        }
      }> = {
        type: 'Group',
        alias: 'root',
        fields: {
          a: {
            type: 'Field',
            initialValue: 'A',
            alias: 'a'
          },
          b: {
            type: 'Group',
            alias: 'b',
            fields: {
              c: {
                type: 'Field',
                initialValue: 'C',
                alias: 'c'
              },
              d: {
                alias: 'd',
                type: 'Group',
                fields: {
                  e: {
                    type: 'Field',
                    initialValue: 'E',
                    alias: 'e'
                  }
                }
              }
            }
          }
        }
      };

      const form = createForm(formDefinition);
      form.typedControls.b.typedControls.d.typedControls.e.setErrors({required: true});

      expect(extractErrorsWithAliasPrefix(form.typedControls.b.typedControls.d.typedControls.e)).toEqual({'root.b.d.e.required': true});
    });
  });

  describe('toString', () => {
    it('should return empty string when undefined', () => {
      const input = undefined;
      const result = toString(input);
      expect(result).toEqual('');
    });
    it('should return empty string when null', () => {
      const input = null;
      const result = toString(input);
      expect(result).toEqual('');
    });
    it('should return string unchanged', () => {
      const input = 'Test';
      const result = toString(input);
      expect(result).toEqual(input);
    });
  });

  describe('toNumber', () => {
    it('should return 0 when undefined', () => {
      const input = undefined;
      const result = toNumber(input);
      expect(result).toBe(0);
    });
    it('should return 0 when null', () => {
      const input = null;
      const result = toNumber(input);
      expect(result).toBe(0);
    });
    it('should return parsed number', () => {
      const input = '1234';
      const result = toNumber(input);
      expect(result).toBe(1234);
    });
    it('should return number -1 unchanged', () => {
      const input = -1;
      const result = toNumber(input);
      expect(result).toBe(input);
    });
    it('should return number 0 unchanged', () => {
      const input = 0;
      const result = toNumber(input);
      expect(result).toBe(input);
    });
    it('should return number 1 unchanged', () => {
      const input = 1;
      const result = toNumber(input);
      expect(result).toBe(input);
    });
  });

  describe('toBoolean', () => {
    it('should return false when undefined', () => {
      const input = undefined;
      const result = toBoolean(input);
      expect(result).toBeFalsy();
    });
    it('should return false when null', () => {
      const input = null;
      const result = toBoolean(input);
      expect(result).toBeFalsy();
    });
    it('should return parsed boolean for all strings', () => {
      const input = [
        { input: 'test', expected: true },
        { input: 'true', expected: true },
        { input: 'false', expected: false },
        { input: 'True', expected: true },
        { input: 'False', expected: false },
        { input: 'TRUE', expected: true },
        { input: 'FALSE', expected: false },
        { input: '', expected: false },
        { input: '111', expected: true },
        { input: '1', expected: true },
        { input: '0', expected: false }
      ];
      input.forEach(test => {
        const result = toBoolean(test.input);
        expect(result).toBe(test.expected);
      });
    });
    it('should return boolean unchanged', () => {
      const input = [
        true,
        false
      ];
      input.forEach(test => {
        const result = toBoolean(test);
        expect(result).toBe(test);
      });
    });
  });

  describe('toStringArray', () => {
    it('should return empty array when undefined', () => {
      const input = undefined;
      const result = toStringArray(input);
      expect(result).toEqual([]);
    });
    it('should return empty array when null', () => {
      const input = null;
      const result = toStringArray(input);
      expect(result).toEqual([]);
    });
    it('should return array unchanged', () => {
      const input = ['Bla', 'Test', 'Hallo', 'Weee'];
      const result = toStringArray(input);
      expect(result).toEqual(input);
    });
  });

  describe('toNumberArray', () => {
    it('should return empty array when undefined', () => {
      const input = undefined;
      const result = toNumberArray(input);
      expect(result).toEqual([]);
    });
    it('should return empty array when null', () => {
      const input = null;
      const result = toNumberArray(input);
      expect(result).toEqual([]);
    });
    it('should return array with parsed numbers', () => {
      const input = ['1', '2', '3'];
      const result = toNumberArray(input);
      expect(result).toEqual([1, 2, 3]);
    });
    it('should return array with numbers unchanged', () => {
      const input = [1, 2, 3];
      const result = toNumberArray(input);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('toBooleanArray', () => {
    it('should return empty array when undefined', () => {
      const input = undefined;
      const result = toBooleanArray(input);
      expect(result).toEqual([]);
    });
    it('should return empty array when null', () => {
      const input = null;
      const result = toBooleanArray(input);
      expect(result).toEqual([]);
    });
    it('should return array with parsed parsed boolean for all strings', () => {
      const input = ['test', 'true', 'false', 'True', 'False', 'TRUE', 'FALSE', '', '111', '1', '0'];
      const result = toBooleanArray(input);
      expect(result).toEqual([true, true, false, true, false, true, false, false, true, true, false]);
    });
    it('should return array with boolean unchanged', () => {
      const input = [true, false];
      const result = toBooleanArray(input);
      expect(result).toEqual([true, false]);
    });
  });

  describe('getMapper', () => {
    it('should return toString when "string"', () => {
      const input = 'string';
      const result = getMapper<string>(input);
      expect(result).toBe(toString);
    });
    it('should return toNumber when "number"', () => {
      const input = 'number';
      const result = getMapper<number>(input);
      expect(result).toBe(toNumber);
    });
    it('should return toBoolean when "boolean"', () => {
      const input = 'boolean';
      const result = getMapper<boolean>(input);
      expect(result).toBe(toBoolean);
    });
    it('should return toStringArray when "string[]"', () => {
      const input = 'string[]';
      const result = getMapper<string[]>(input);
      expect(result).toBe(toStringArray);
    });
    it('should return toNumberArray when "number[]"', () => {
      const input = 'number[]';
      const result = getMapper<number[]>(input);
      expect(result).toBe(toNumberArray);
    });
    it('should return toBooleanArray when "boolean[]"', () => {
      const input = 'boolean[]';
      const result = getMapper<boolean[]>(input);
      expect(result).toBe(toBooleanArray);
    });
    it('should return mapperFn when none of the above', () => {
      const input = (bla: string) => bla;
      const result = getMapper(input);
      expect(result).toBe(input);
    });
  });
});
