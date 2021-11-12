import { createForm } from '../forms/form-creation';
import { TypedFormControl } from '../forms/typed-form-control';
import { deepGet, extractErrorsWithAliasPrefix, getAliasFromControl } from '../helper';
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
});
