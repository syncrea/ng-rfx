import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {getFormState} from '../forms/form-state';
import {TypedFormControl, TypedFormGroup} from '../forms/typed-form-control';

interface SimpleForm {
  firstName: string;
  lastName: string;
}

describe('Form personEditFormState', () => {
  describe('getFormState', () => {
    it('should return simple personForm group', () => {
      const formGroup = new FormGroup({
        firstName: new FormControl('Gion'),
        lastName: new FormControl('Kunz')
      });

      const formState = getFormState<SimpleForm>(formGroup);
      expect(formState).toEqual({
        dirty: false,
        invalid: false,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: true,
        disabled: false,
        enabled: true,
        errors: null,
        value: {
          firstName: 'Gion',
          lastName: 'Kunz'
        },
        fields: {
          firstName: {
            value: 'Gion',
            dirty: false,
            invalid: false,
            pending: false,
            pristine: true,
            touched: false,
            untouched: true,
            valid: true,
            disabled: false,
            enabled: true,
            errors: null
          },
          lastName: {
            value: 'Kunz',
            dirty: false,
            invalid: false,
            pending: false,
            pristine: true,
            touched: false,
            untouched: true,
            valid: true,
            disabled: false,
            enabled: true,
            errors: null
          }
        }
      });
    });

    it('should return personForm personEditFormState array for simple personForm array', () => {
      interface SimpleFormArray extends Array<string> {
        [index: number]: string;
      }

      const formArray = new FormArray([
        new FormControl('Apples'),
        new FormControl('Bananas'),
        new FormControl('Cherries'),
      ]);

      const formStateArray = getFormState<SimpleFormArray>(formArray);
      expect(formStateArray).toEqual({
        dirty: false,
        invalid: false,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: true,
        disabled: false,
        enabled: true,
        errors: null,
        value: ['Apples', 'Bananas', 'Cherries'],
        items: [{
          value: 'Apples',
          dirty: false,
          invalid: false,
          pending: false,
          pristine: true,
          touched: false,
          untouched: true,
          valid: true,
          disabled: false,
          enabled: true,
          errors: null
        }, {
          value: 'Bananas',
          dirty: false,
          invalid: false,
          pending: false,
          pristine: true,
          touched: false,
          untouched: true,
          valid: true,
          disabled: false,
          enabled: true,
          errors: null
        }, {
          value: 'Cherries',
          dirty: false,
          invalid: false,
          pending: false,
          pristine: true,
          touched: false,
          untouched: true,
          valid: true,
          disabled: false,
          enabled: true,
          errors: null
        }]
      });
    });

    it('should return personForm personEditFormState control for simple native value', () => {
      const formControl = new FormControl('Apples');

      const formStateControl = getFormState<string>(formControl);
      expect(formStateControl).toEqual({
        dirty: false,
        invalid: false,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: true,
        disabled: false,
        enabled: true,
        errors: null,
        value: 'Apples'
      });
    });
  });

  describe('typed personForm controls', () => {
    it('should return personForm personEditFormState control for simple native value', () => {
      const formControl = new TypedFormControl<string>('Apples');

      const formStateControl = getFormState(formControl);
      expect(formStateControl).toEqual({
        dirty: false,
        invalid: false,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: true,
        disabled: false,
        enabled: true,
        errors: null,
        value: 'Apples'
      });
    });

    it('should return personForm personEditFormState control for simple typed personForm group', () => {
      const formGroup = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl<string>('Gion'),
        lastName: new TypedFormControl<string>('Kunz')
      });

      const formState = getFormState(formGroup);
      expect(formState).toEqual({
        dirty: false,
        invalid: false,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: true,
        disabled: false,
        enabled: true,
        errors: null,
        value: {
          firstName: 'Gion',
          lastName: 'Kunz'
        },
        fields: {
          firstName: {
            value: 'Gion',
            dirty: false,
            invalid: false,
            pending: false,
            pristine: true,
            touched: false,
            untouched: true,
            valid: true,
            disabled: false,
            enabled: true,
            errors: null
          },
          lastName: {
            value: 'Kunz',
            dirty: false,
            invalid: false,
            pending: false,
            pristine: true,
            touched: false,
            untouched: true,
            valid: true,
            disabled: false,
            enabled: true,
            errors: null
          }
        }
      });
    });
  });
});
