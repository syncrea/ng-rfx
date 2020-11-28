import { createForm, pushFormGroupArrayItem } from '../forms/form-creation';
import { testFormDefinitionLong, testFormDefinitionShort, testFormDefinitionWithMapper } from './sample-form';
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

    it('should create personForm from mapping definition', () => {
      const form = createForm(testFormDefinitionWithMapper);
      expect(form.typedValue).toEqual({
        name: 'First name',
        middleName: '',
        age: 33,
        hasFamily: false,
        colors: ['Red', 'Green', 'Blue'],
        numbers: [1, 2, 3],
        accepted: [false, false, false, false],
        address: {
          street: 'TESTSTREET',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }],
        favoriteNumber: null
      });
    });

    it('should create personForm from mapping definition and use mappers when accessing controls directly', () => {
      const form = createForm(testFormDefinitionWithMapper);
      expect(form.typedControls.name.typedValue).toEqual('First name');
      expect(form.typedControls.middleName.typedValue).toEqual('');
      expect(form.typedControls.age.typedValue).toEqual(33);
      expect(form.typedControls.hasFamily.typedValue).toEqual(false);
      expect(form.typedControls.colors.typedValue).toEqual(['Red', 'Green', 'Blue']);
      expect(form.typedControls.numbers.typedValue).toEqual([1, 2, 3]);
      expect(form.typedControls.accepted.typedValue).toEqual([false, false, false, false]);
      expect(form.typedControls.address.typedValue).toEqual({
        street: 'TESTSTREET',
        no: 1
      });
      expect(form.typedControls.address.typedControls.street.typedValue).toEqual('Teststreet');
      expect(form.typedControls.address.typedControls.no.typedValue).toEqual(1);
      expect(form.typedControls.children.typedValue).toEqual([{
        name: 'Zoé',
        age: 0
      }]);
      expect(form.typedControls.children.typedControls[0].typedValue).toEqual({
        name: 'Zoé',
        age: 0
      });
      expect(form.typedControls.children.typedControls[0].typedControls.name.typedValue).toEqual('Zoé');
      expect(form.typedControls.children.typedControls[0].typedControls.age.typedValue).toEqual(0);
      expect(form.typedControls.favoriteNumber.typedValue).toEqual(null);
    });

    it('should create personForm from mapping definition and use mappers when strings are set and patched', () => {
      const form = createForm(testFormDefinitionWithMapper);
      form.typedControls.name.patchValue('Name');
      form.typedControls.middleName.patchValue('MiddleName');
      form.typedControls.age.setValue('44' as any);
      form.typedControls.hasFamily.setValue('true' as any);
      form.typedControls.colors.setValue(['Yellow', 'Orange', 'Black'] as any);
      form.typedControls.numbers.setValue(['1', '2', '10'] as any);
      form.typedControls.accepted.setValue(['true', 'false', '1', '0'] as any);
      form.typedControls.address.typedControls.street.setValue('street');
      expect(form.typedValue).toEqual({
        name: 'Name',
        middleName: 'MiddleName',
        age: 44,
        hasFamily: true,
        colors: ['Yellow', 'Orange', 'Black'],
        numbers: [1, 2, 10],
        accepted: [true, false, true, false],
        address: {
          street: 'STREET',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }],
        favoriteNumber: null
      });
    });

    it('should create personForm from mapping definition and use mappers when strings are set and patched and accessing controls directly', () => {
      const form = createForm(testFormDefinitionWithMapper);
      form.typedControls.name.patchValue('Name');
      form.typedControls.middleName.patchValue('MiddleName');
      form.typedControls.age.setValue('44' as any);
      form.typedControls.hasFamily.setValue('true' as any);
      form.typedControls.colors.setValue(['Yellow', 'Orange', 'Black'] as any);
      form.typedControls.numbers.setValue(['1', '2', '10'] as any);
      form.typedControls.accepted.setValue(['true', 'false', '1', '0'] as any);
      form.typedControls.address.typedControls.street.setValue('street');
      expect(form.typedControls.name.typedValue).toEqual('Name');
      expect(form.typedControls.middleName.typedValue).toEqual('MiddleName');
      expect(form.typedControls.age.typedValue).toEqual(44);
      expect(form.typedControls.hasFamily.typedValue).toEqual(true);
      expect(form.typedControls.colors.typedValue).toEqual(['Yellow', 'Orange', 'Black']);
      expect(form.typedControls.numbers.typedValue).toEqual([1, 2, 10]);
      expect(form.typedControls.accepted.typedValue).toEqual([true, false, true, false]);
      expect(form.typedControls.address.typedValue).toEqual({
        street: 'STREET',
        no: 1
      });
      expect(form.typedControls.address.typedControls.street.typedValue).toEqual('street');
      expect(form.typedControls.address.typedControls.no.typedValue).toEqual(1);
      expect(form.typedControls.children.typedValue).toEqual([{
        name: 'Zoé',
        age: 0
      }]);
      expect(form.typedControls.children.typedControls[0].typedValue).toEqual({
        name: 'Zoé',
        age: 0
      });
      expect(form.typedControls.children.typedControls[0].typedControls.name.typedValue).toEqual('Zoé');
      expect(form.typedControls.children.typedControls[0].typedControls.age.typedValue).toEqual(0);
      expect(form.typedControls.favoriteNumber.typedValue).toEqual(null);
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
