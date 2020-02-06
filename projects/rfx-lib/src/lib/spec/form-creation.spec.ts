import { createForm, pushFormGroupArrayItem } from '../forms/form-creation';
import { testFormDefinitionLong, testFormDefinitionShort } from './sample-form';

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
