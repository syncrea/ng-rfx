import { async } from '@angular/core/testing';
import { testFormDefinitionLong } from './sample-form';
import { ObserveFormPipe } from '../forms/observe-form.pipe';
import { FormRegistry } from '../forms/form-registry.service';
import { FormRegistryKey } from '../model';

describe('Observe form pipe', () => {
  describe('Strict mode', () => {
    it('should return form control when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: true, observe: 'FormControl'});
      observable.subscribe(formGroup => {
        expect(formGroup).toBeDefined();
        expect(formGroup.typedControls.name.typedValue).toBe('First name');
      });
    }));

    it('should return form data when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: true, observe: 'FormData'});
      observable.subscribe(formData => {
        expect(formData).toBeDefined();
        expect(formData.state.value.name).toBe('First name');
      });
    }));

    it('should return form state when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: true, observe: 'FormState'});
      observable.subscribe(formState => {
        expect(formState).toBeDefined();
        expect(formState.value.name).toBe('First name');
      });
    }));

    it('should return form value when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: true, observe: 'FormValue'});
      observable.subscribe(formValue => {
        expect(formValue).toBeDefined();
        expect(formValue.name).toBe('First name');
      });
    }));

    it('should return form control as default observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: true});
      observable.subscribe(formControl => {
        expect(formControl).toBeDefined();
        expect(formControl.typedControls.name.typedValue).toBe('First name');
      });
    }));

    it('should return form control and use strict mode when no options are provided', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey);
      observable.subscribe(formControl => {
        expect(formControl).toBeDefined();
        expect(formControl.typedControls.name.typedValue).toBe('First name');
      });
    }));

    it('should throw exception when null key is passed to pipe in strict mode', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey: FormRegistryKey<string> = null as any;
      expect(() => observeFormPipe.transform(formKey)).toThrowError('null was passed to ObserveFormPipe while in strict mode');
    }));

    it('should throw exception when undefined key is passed to pipe in strict mode', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey: FormRegistryKey<string> = undefined as any;
      expect(() => observeFormPipe.transform(formKey)).toThrowError('undefined was passed to ObserveFormPipe while in strict mode');
    }));
  });

  describe('Non-strict', () => {
    it('should return form control when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: false, observe: 'FormControl'});
      expect(observable).toBeDefined();
      if (!observable) {
        return;
      }

      observable.subscribe((formGroup) => {
        expect(formGroup).toBeDefined();
        if (!formGroup) {
          return;
        }
        expect(formGroup.typedControls.name.typedValue).toBe('First name');
      });
    }));

    it('should return form data when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: false, observe: 'FormData'});
      expect(observable).toBeDefined();
      if (!observable) {
        return;
      }

      observable.subscribe(formData => {
        expect(formData).toBeDefined();
        if (!formData) {
          return;
        }
        expect(formData.state.value.name).toBe('First name');
      });
    }));

    it('should return form state when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: false, observe: 'FormState'});
      expect(observable).toBeDefined();
      if (!observable) {
        return;
      }

      observable.subscribe(formState => {
        expect(formState).toBeDefined();
        if (!formState) {
          return;
        }
        expect(formState.value.name).toBe('First name');
      });
    }));

    it('should return form value when observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: false, observe: 'FormValue'});
      expect(observable).toBeDefined();
      if (!observable) {
        return;
      }

      observable.subscribe(formValue => {
        expect(formValue).toBeDefined();
        if (!formValue) {
          return;
        }
        expect(formValue.name).toBe('First name');
      });
    }));

    it('should return form control as default observed', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const observable = observeFormPipe.transform(formKey, {strict: false});
      expect(observable).toBeDefined();
      if (!observable) {
        return;
      }

      observable.subscribe(formControl => {
        expect(formControl).toBeDefined();
        if (!formControl) {
          return;
        }
        expect(formControl.typedControls.name.typedValue).toBe('First name');
      });
    }));

    it('should not throw error for missing key', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = '123';

      const observable = observeFormPipe.transform(formKey, {strict: false});
      expect(observable).toBe(null);
    }));

    it('should not throw error for null key', async(() => {
      const formRegistry = new FormRegistry();
      const observeFormPipe = new ObserveFormPipe(formRegistry);
      const formKey = null as any;

      const observable = observeFormPipe.transform(formKey, {strict: false, observe: 'FormData'});
      expect(observable).toBe(null);
    }));
  });
});
