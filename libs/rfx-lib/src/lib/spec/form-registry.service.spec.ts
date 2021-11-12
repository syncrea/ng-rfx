import { Validators } from '@angular/forms';
import { FormDefinition } from '../model';
import { createForm } from '../forms/form-creation';
import { FormRegistry } from '../forms/form-registry.service';
import { raiseError } from '../helper';

describe('FormRegistryService', () => {
  describe('simple service tests', () => {
    it('should register custom personForm', () => {
      const service = new FormRegistry();

      interface SimpleForm {
        readonly firstName: string;
        readonly lastName: string;
      }

      const simpleFormDefinition: FormDefinition<SimpleForm> = {
        type: 'Group',
        fields: {
          firstName: '',
          lastName: ''
        }
      };

      const simpleFormKey = service.createAndRegisterForm(simpleFormDefinition);
      const obtainedSimpleForm = service.getForm(simpleFormKey) || raiseError('Form could not be obtained from service.');
      obtainedSimpleForm.typedGet('firstName').setValue('First name');
      expect(obtainedSimpleForm.typedGet('firstName').typedValue).toBe('First name');
    });

    it('should remove registered personForm', () => {
      const service = new FormRegistry();

      interface SimpleForm {
        readonly firstName: string;
        readonly lastName: string;
      }

      const simpleFormDefinition: FormDefinition<SimpleForm> = {
        type: 'Group',
        fields: {
          firstName: '',
          lastName: ''
        }
      };

      const simpleFormKey = service.createAndRegisterForm(simpleFormDefinition);
      expect(service.containsForm(simpleFormKey)).toBe(true);
      service.removeForm(simpleFormKey);
      expect(service.containsForm(simpleFormKey)).toBe(false);
    });

    it('should create and register custom personForm', () => {
      const service = new FormRegistry();

      interface SimpleForm {
        readonly firstName: string;
        readonly lastName: string;
      }

      const simpleFormDefinition: FormDefinition<SimpleForm> = {
        type: 'Group',
        fields: {
          firstName: {
            type: 'Field',
            initialValue: '',
            options: {
              validators: [Validators.required]
            }
          },
          lastName: ''
        }
      };

      const form = createForm(simpleFormDefinition);

      const simpleFormKey = service.registerForm(form);
      const obtainedSimpleForm = service.getForm(simpleFormKey) || raiseError('Form could not be obtained from service.');
      obtainedSimpleForm.typedGet('firstName').setValue('First name');

      expect(obtainedSimpleForm.typedGet('firstName').typedValue).toBe('First name');
    });

    it('should emit personForm changes to observers', () => {
      const service = new FormRegistry();

      interface SimpleForm {
        readonly firstName: string;
        readonly lastName: string;
      }

      const simpleFormDefinition: FormDefinition<SimpleForm> = {
        type: 'Group',
        fields: {
          firstName: {
            type: 'Field',
            initialValue: '',
            options: {
              validators: [Validators.required]
            }
          },
          lastName: ''
        }
      };

      const form = createForm(simpleFormDefinition);

      const subscriptionSpy = jest.fn();

      const simpleFormKey = service.registerForm(form);
      const formObservable = service.observeForm(simpleFormKey) || raiseError('Form could not be obtained from service.');
      formObservable.subscribe(subscriptionSpy);

      form.setValue({
        firstName: 'First name',
        lastName: 'Last name'
      });

      expect(subscriptionSpy).toHaveBeenCalledTimes(2);
      // Initial call was with initial personForm description values (empty strings)
      expect((<SimpleForm>subscriptionSpy.mock.calls[0][0]).firstName).toBe('');
      expect((<SimpleForm>subscriptionSpy.mock.calls[0][0]).lastName).toBe('');
      // Second call is from the updated form data
      expect((<SimpleForm>subscriptionSpy.mock.calls[1][0]).firstName).toBe('First name');
      expect((<SimpleForm>subscriptionSpy.mock.calls[1][0]).lastName).toBe('Last name');
    });
  });
});
