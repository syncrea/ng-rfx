import { createForm, createNativeForm, pushFormGroupArrayItem } from '../forms/form-creation';
import { testFormDefinitionLong, testFormDefinitionShort } from './sample-form';
import { FormDefinition } from '../model';
import { TypedFormControl } from '../forms/typed-form-control';
import { FormControl, FormGroup } from '@angular/forms';

describe('Form creation', () => {

  describe('createForm', () => {
    it('should create personForm control for primitive type', () => {
      const control = createForm<string>('Hello');
      expect(control.typedValue).toBe('Hello');
    });

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

    it('should throw error when used on custom field', () => {
      interface ObjectArrayCustomFieldForm {
        custom: { id: string, name: string}[];
      }

      const objectArrayCustomFieldFormDefinition: FormDefinition<ObjectArrayCustomFieldForm> = {
        type: 'Group',
        fields: {
          custom: {
            type: 'CustomField',
            initialValue: [{id: '1', name: 'Item 1'}]
          }
        }
      }

      const form = createForm(objectArrayCustomFieldFormDefinition);
      const run = () => pushFormGroupArrayItem(objectArrayCustomFieldFormDefinition.fields.custom, form.typedControls.custom, {
        id: '2',
        name: 'Item 2'
      });

      expect(run).toThrowError();
    });

    it('should not emit event from push if instructed', async() => {
      const form = createForm(testFormDefinitionShort);
      let valueChangeCount = 0;
      form.typedGet('children').typedValueChanges.subscribe(() => valueChangeCount++);

      pushFormGroupArrayItem(testFormDefinitionShort.fields.children, form.typedGet('children'), {
        name: 'New Child',
        age: 0
      });

      pushFormGroupArrayItem(testFormDefinitionShort.fields.children, form.typedGet('children'), {
        name: 'Yet Another Child',
        age: 0
      }, {
        emitEvent: false
      });

      expect(form.typedValue.children).toEqual(
        [{
          name: 'Zoé',
          age: 0
        }, {
          name: 'New Child',
          age: 0
        }, {
          name: 'Yet Another Child',
          age: 0
        }]
      );

      expect(valueChangeCount).toBe(1);
    });
  });

  describe('createNativeForm', () => {
    it('should create form control for primitive type', () => {
      const control = createNativeForm<string>('Hello');
      expect(control.value).toBe('Hello');
    });

    it('should create form control for primitive array type', () => {
      const control = createNativeForm<string[]>(['Hello', 'World']);
      expect(control.value).toEqual(['Hello', 'World']);
    });

    it('should create personForm from longhand definition', () => {
      const form = createNativeForm(testFormDefinitionLong);
      expect(form.value).toEqual({
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
      const form = createNativeForm(testFormDefinitionShort);
      expect(form.value).toEqual({
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
});
