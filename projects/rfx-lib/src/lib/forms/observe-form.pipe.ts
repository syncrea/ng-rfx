import { Pipe, PipeTransform, ChangeDetectorRef, WrappedValue } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormState, FormData, FormRegistryKey, TypedFormControlInfer } from '../model';
import { FormRegistry } from './form-registry.service';

import { deepEquals } from '../helper';

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
  private latestObservedValue: unknown;
  private latestReturnedValue: unknown;
  private latestObservable: Observable<unknown>;
  private subscription: Subscription;

  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormData', strict: false}): FormData<F> | null;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormState', strict: false}): FormState<F> | null;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormValue', strict: false}): F | null;
  // Observe form control is default
  transform<F>(formKey: FormRegistryKey<F>, options: {observe?: 'FormControl', strict: false}): TypedFormControlInfer<F> | null;
  // Strict mode is default
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormData', strict?: true}): FormData<F>;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormState', strict?: true}): FormState<F>;
  transform<F>(formKey: FormRegistryKey<F>, options: {observe: 'FormValue', strict?: true}): F;
  // Default with no arguments
  transform<F>(formKey: FormRegistryKey<F>, options?: {observe?: 'FormControl', strict?: true}): TypedFormControlInfer<F>;
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

      this.handleSubscription(of(null));
    } else if (observe === 'FormState') {
      this.handleSubscription(formData.pipe(map(data => data.state)));
    } else if (observe === 'FormControl') {
      this.handleSubscription(formData.pipe(map(data => data.control)));
    } else if (observe === 'FormData') {
      this.handleSubscription(formData);
    } else {
      this.handleSubscription(formData.pipe(map(data => data.control.typedValue)));
    }

    this.latestReturnedValue = this.latestObservedValue;
    return WrappedValue.wrap(this.latestObservedValue);
  }

  private handleSubscription(observable: Observable<unknown>) {
    if (this.latestObservable === observable) {
      return;
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = observable.subscribe(value => {
      this.latestObservedValue = value;
      if (!deepEquals(this.latestObservedValue, this.latestReturnedValue)) {
        this.cdr.markForCheck();
      }
    });
  }

  constructor(private formRegistry: FormRegistry, private cdr: ChangeDetectorRef) {}
}
