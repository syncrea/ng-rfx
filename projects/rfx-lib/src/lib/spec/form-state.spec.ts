import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {getFormState} from '../forms/form-state';
import {TypedFormArray, TypedFormControl, TypedFormGroup} from '../forms/typed-form-control';
import { raiseError } from '../helper';

interface SimpleForm {
  firstName: string;
  lastName: string;
}

describe('Form personEditFormState', () => {
  describe('getFormState', () => {
    it('should return simple personForm group', () => {
      const formGroup = new FormGroup({
        firstName: new FormControl('First name'),
        lastName: new FormControl('Last name')
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
          firstName: 'First name',
          lastName: 'Last name'
        },
        fields: {
          firstName: {
            value: 'First name',
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
            value: 'Last name',
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
        firstName: new TypedFormControl<string>('First name'),
        lastName: new TypedFormControl<string>('Last name')
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
          firstName: 'First name',
          lastName: 'Last name'
        },
        fields: {
          firstName: {
            value: 'First name',
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
            value: 'Last name',
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

  describe('error state', () => {
    it('should be created correctly on invalid control validator', () => {
      const formGroup = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl<string>('First name', {
          validators: [Validators.required]
        }),
        lastName: new TypedFormControl<string>('Last name')
      });
      formGroup.typedControls.firstName.setValue('');

      const formState = getFormState(formGroup, (control: AbstractControl) => control.errors ? Object.keys(control.errors) : null);
      expect(formState).toEqual({
        dirty: false,
        invalid: true,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: false,
        disabled: false,
        enabled: true,
        errors: null,
        value: {
          firstName: '',
          lastName: 'Last name'
        },
        fields: {
          firstName: {
            value: '',
            dirty: false,
            invalid: true,
            pending: false,
            pristine: true,
            touched: false,
            untouched: true,
            valid: false,
            disabled: false,
            enabled: true,
            errors: ['required']
          },
          lastName: {
            value: 'Last name',
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

    it('should be created correctly on invalid group validator', () => {
      function firstNameAndLastNameRequired(group: TypedFormGroup<SimpleForm>): ValidationErrors | null {
        const {firstName, lastName} = group.typedValue;
        if (firstName.length === 0 || lastName.length === 0) {
          return {
            firstNameAndLastNameRequired: true
          };
        } else {
          return null;
        }
      }

      const formGroup = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl<string>('First name'),
        lastName: new TypedFormControl<string>('Last name')
      }, {
        validators: [firstNameAndLastNameRequired]
      });
      formGroup.typedControls.firstName.setValue('');

      const formState = getFormState(formGroup, (control: AbstractControl) => control.errors ? Object.keys(control.errors) : null);
      expect(formState).toEqual({
        dirty: false,
        invalid: true,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: false,
        disabled: false,
        enabled: true,
        errors: ['firstNameAndLastNameRequired'],
        value: {
          firstName: '',
          lastName: 'Last name'
        },
        fields: {
          firstName: {
            value: '',
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
            value: 'Last name',
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

    it('should be created correctly on invalid group validator', () => {
      const formArray = new TypedFormArray([
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl<string>('First name'),
          lastName: new TypedFormControl<string>('Last name')
        }),
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl<string>('First name'),
          lastName: new TypedFormControl<string>('Last name')
        }),
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl<string>('First name', {
            validators: [Validators.required]
          }),
          lastName: new TypedFormControl<string>('Last name')
        })
      ]);
      (formArray.typedAt(2) || raiseError('Element with index 2 could not be obtained!')).typedControls.firstName.setValue('');

      const formGroupStateBase = {
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
          firstName: 'First name',
          lastName: 'Last name'
        },
        fields: {
          firstName: {
            value: 'First name',
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
            value: 'Last name',
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
      };

      const formState = getFormState(formArray, (control: AbstractControl) => control.errors ? Object.keys(control.errors) : null);

      expect(formState).toEqual({
        dirty: false,
        invalid: true,
        pending: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: false,
        disabled: false,
        enabled: true,
        errors: null,
        value: [{
          firstName: 'First name',
          lastName: 'Last name'
        }, {
          firstName: 'First name',
          lastName: 'Last name'
        }, {
          firstName: '',
          lastName: 'Last name'
        }],
        items: [{
          ...formGroupStateBase
        }, {
          ...formGroupStateBase
        }, {
          ...formGroupStateBase,
          value: {
            ...formGroupStateBase.value,
            firstName: ''
          },
          invalid: true,
          valid: false,
          fields: {
            ...formGroupStateBase.fields,
            firstName: {
              ...formGroupStateBase.fields.firstName,
              value: '',
              valid: false,
              invalid: true,
              errors: ['required']
            }
          }
        }]
      });
    });
  });
});
