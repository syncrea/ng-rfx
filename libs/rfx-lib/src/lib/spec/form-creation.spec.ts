import { createForm, pushFormGroupArrayItem } from '../forms/form-creation';
import { testFormDefinitionLong, testFormDefinitionShort } from './sample-form';
import { FormDefinition } from '../model';
import { TypedFormControl } from '../forms/typed-form-control';

describe('Form creation', () => {
  describe('createForm', () => {
    it('should create personForm control for primitive type', () => {
      const control = createForm<string>('Hello');
      expect(control.typedValue).toBe('Hello');
    });
  });

  describe('createForm', () => {
    it('should create personForm from longhand definition', () => {
      const form = createForm(testFormDefinitionLong);
      expect(form.typedValue).toEqual({
        name: 'First name',
        middleName: null,
        age: 33,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }],
        favoriteNumber: null
      });
    });

    it('should create personForm from shorthand definition', () => {
      const form = createForm(testFormDefinitionShort);
      expect(form.typedValue).toEqual({
        name: 'First name',
        middleName: null,
        age: 33,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }],
        favoriteNumber: null
      });
    });
  });

  describe('Custom form field', () => {
    it('should create form with custom field', () => {
      interface FormWithCustomField {
        firstName: string;
        lastName: string;
        address: {
          street: string;
          no: number;
        };
      }

      const formWithCustomFieldDefinition: FormDefinition<FormWithCustomField> = {
        type: 'Group',
        fields: {
          firstName: 'First Name',
          lastName: 'Last Name',
          address: {
            type: 'CustomField',
            initialValue: {
              street: 'Default street',
              no: 5
            }
          }
        }
      };

      const form = createForm(formWithCustomFieldDefinition);
      const address = form.typedGetCustomField('address');
      expect(address instanceof TypedFormControl).toBe(true);
      expect(address.typedValue).toEqual({
        street: 'Default street',
        no: 5
      });
    });
  });

  describe('pushFormGroupArrayItem', () => {
    it('should add new personForm item as per definition', () => {
      const form = createForm(testFormDefinitionShort);
      pushFormGroupArrayItem(testFormDefinitionShort.fields.children, form.typedGet('children'), {
        name: 'New Child',
        age: 0
      });

      expect(form.typedValue).toEqual({
        name: 'First name',
        middleName: null,
        age: 33,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }, {
          name: 'New Child',
          age: 0
        }],
        favoriteNumber: null
      });
    });
  });
});
