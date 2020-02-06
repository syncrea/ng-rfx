import { Pipe, PipeTransform } from '@angular/core';
import { FormState, FormData, FormRegistryKey, TypedFormControlInfer } from '../model';
import { FormRegistry } from './form-registry.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type ObserveFormType = 'FormData' | 'FormState' | 'FormControl' | 'FormValue';

export interface ObserveFormPipeOptions {
  readonly observe?: ObserveFormType;
  readonly strict?: boolean;
}

@Pipe({
  name: 'observeForm',
  pure: false
})
export class ObserveFormPipe implements PipeTransform {
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormData', strict: false}): Observable<FormData<F>> | null;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormState', strict: false}): Observable<FormState<F>> | null;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormValue', strict: false}): Observable<F> | null;
  // Observe form control is default
  transform<F>(formKey: FormRegistryKey<F>, options: {observe?: 'FormControl', strict: false}): Observable<TypedFormControlInfer<F>> | null;
  // Strict mode is default
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormData', strict?: true}): Observable<FormData<F>>;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormState', strict?: true}): Observable<FormState<F>>;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormValue', strict?: true}): Observable<F>;
  // Default with no arguments
  transform<F>(formKey: FormRegistryKey<F>, options?: {observe?: 'FormControl', strict?: true}): Observable<TypedFormControlInfer<F>>;
  transform(formKey: FormRegistryKey<any>, {observe: observe = 'FormControl', strict: strict = true}: ObserveFormPipeOptions = {}): any {
    if (formKey === null || formKey === undefined) {
      if (strict) {
        throw new Error(`${formKey} was passed to ObserveFormPipe while in strict mode`);
      }

      return null;
    }

    const formData = this.formRegistry.observeForm(formKey);
    if (!formData) {
      if (strict) {
        throw new Error(`ObserveFormPipe could not find form for key ${typeof formKey === 'string' ? formKey : formKey.id} while in strict mode`);
      }

      return null;
    } else if (observe === 'FormState') {
      return formData.pipe(map(data => data.state));
    } else if (observe === 'FormControl') {
      return formData.pipe(map(data => data.control));
    } else if (observe === 'FormData') {
      return formData;
    } else {
      return formData.pipe(map(data => data.control.typedValue));
    }
  }

  constructor(private formRegistry: FormRegistry) {}
}
