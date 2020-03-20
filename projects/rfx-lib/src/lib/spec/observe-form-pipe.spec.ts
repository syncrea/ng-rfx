import { async } from '@angular/core/testing';
import { testFormDefinitionLong } from './sample-form';
import { ObserveFormPipe } from '../forms/observe-form.pipe';
import { FormRegistry } from '../forms/form-registry.service';
import { FormRegistryKey } from '../model';
import { ChangeDetectorRef, WrappedValue } from '@angular/core';

export class MockChangeDetectorRef extends ChangeDetectorRef {
  checkNoChanges() {}
  detach() {}
  detectChanges() {}
  markForCheck() {}
  reattach() {}
}

describe('Observe form pipe', () => {
  describe('Strict mode', () => {
    it('should return form control when observed', () => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formGroup = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: true, observe: 'FormControl'}));
      expect(formGroup).toBeDefined();
      expect(formGroup.typedControls.name.typedValue).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    });

    it('should return form data when observed', () => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formData = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: true, observe: 'FormData'}));
      expect(formData).toBeDefined();
      expect(formData.state.value.name).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    });

    it('should return form state when observed', () => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formState = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: true, observe: 'FormState'}));
      expect(formState).toBeDefined();
      expect(formState.value.name).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    });

    it('should return form value when observed', () => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formValue = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: true, observe: 'FormValue'}));
      expect(formValue).toBeDefined();
      expect(formValue.name).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    });

    it('should return form control as default observed', () => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formControl = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: true}));
      expect(formControl).toBeDefined();
      expect(formControl.typedControls.name.typedValue).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    });

    it('should return form control and use strict mode when no options are provided', () => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formControl = WrappedValue.unwrap(observeFormPipe.transform(formKey));
      expect(formControl).toBeDefined();
      expect(formControl.typedControls.name.typedValue).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    });

    it('should throw exception when null key is passed to pipe in strict mode', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey: FormRegistryKey<string> = null as any;
      expect(() => observeFormPipe.transform(formKey)).toThrowError('null was passed to ObserveFormPipe while in strict mode');
    }));

    it('should throw exception when undefined key is passed to pipe in strict mode', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey: FormRegistryKey<string> = undefined as any;
      expect(() => observeFormPipe.transform(formKey)).toThrowError('undefined was passed to ObserveFormPipe while in strict mode');
    }));
  });

  describe('Non-strict', () => {
    it('should return form control when observed', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formGroup = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false, observe: 'FormControl'}));
      expect(formGroup).toBeDefined();
      expect(formGroup.typedControls.name.typedValue).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    }));

    it('should return form data when observed', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formData =  WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false, observe: 'FormData'}));
      expect(formData).toBeDefined();
      expect(formData.state.value.name).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    }));

    it('should return form state when observed', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formState = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false, observe: 'FormState'}));
      expect(formState).toBeDefined();
      expect(formState.value.name).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    }));

    it('should return form value when observed', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formValue = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false, observe: 'FormValue'}));
      expect(formValue).toBeDefined();
      expect(formValue.name).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    }));

    it('should return form control as default observed', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = formRegistry.createAndRegisterForm(testFormDefinitionLong);

      const formControl = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false}));
      expect(formControl).toBeDefined();
      expect(formControl.typedControls.name.typedValue).toBe('First name');
      expect(spyMarkForCheck).toHaveBeenCalled();
    }));

    it('should not throw error for missing key', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = '123';

      const formData = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false}));
      expect(formData).toBe(null);
      expect(spyMarkForCheck).toHaveBeenCalled();
    }));

    it('should not throw error for null key', async(() => {
      const formRegistry = new FormRegistry();
      const mockChangeDetectorRef = new MockChangeDetectorRef();
      const spyMarkForCheck = spyOn(mockChangeDetectorRef, 'markForCheck');
      const observeFormPipe = new ObserveFormPipe(formRegistry, mockChangeDetectorRef);
      const formKey = null as any;

      const formData = WrappedValue.unwrap(observeFormPipe.transform(formKey, {strict: false, observe: 'FormData'}));
      expect(formData).toBe(null);
      expect(spyMarkForCheck).not.toHaveBeenCalled();
    }));
  });
});
