import {PrimitiveType} from '../model';
import {AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';

export class TypedFormControl<T> extends FormControl {
  constructor(formState?: T, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  get typedValue(): T {
    return this.value;
  }

  patchValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.patchValue(value, options);
  }

  setValue(value: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.setValue(value, options);
  }

  reset(formState?: T, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.reset(formState, options);
  }

  get typedValueChanges(): Observable<T> {
    return this.valueChanges;
  }
}

type TypedFormGroupChildInternal<F, K extends keyof F> =
  F[K] extends PrimitiveType ? TypedFormControl<F[K]> :
  F[K] extends any[] ? TypedFormArray<F[K][0]> : TypedFormGroup<F[K]>;

export class TypedFormGroup<F> extends FormGroup {
  constructor(controls?: {[K in keyof F]: TypedFormGroupChildInternal<F, K>}, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  get typedValue(): F {
    return this.value;
  }

  typedGet<K extends keyof F>(key: K): TypedFormGroupChildInternal<F, K> {
    const childControl = super.get(<string>key);
    if (childControl instanceof TypedFormControl || childControl instanceof TypedFormGroup || childControl instanceof TypedFormArray) {
      return <TypedFormGroupChildInternal<F, K>>childControl;
    } else {
      return null;
    }
  }

  patchValue(value: Partial<F>, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.patchValue(value, options);
  }

  setValue(value: F, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.setValue(value, options);
  }

  reset(formState?: F, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.reset(formState, options);
  }

  get typedValueChanges(): Observable<F> {
    return this.valueChanges;
  }
}

type TypedFormControlOrGroupArrayInternal<T> = T extends PrimitiveType ? TypedFormControl<T> : TypedFormGroup<T>;

export class TypedFormArray<T> extends FormArray {
  constructor(controls?: TypedFormControlOrGroupArrayInternal<T>[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  get typedValue(): T[] {
    return this.value;
  }

  typedAt(index: number): TypedFormControlOrGroupArrayInternal<T> | null {
    const childControl = super.at(index);
    if (childControl instanceof TypedFormControl || childControl instanceof TypedFormGroup) {
      return <any>childControl;
    } else {
      return null;
    }
  }

  patchValue(value: T[], options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.patchValue(value, options);
  }

  setValue(value: T[], options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }): void {
    super.setValue(value, options);
  }

  reset(formState?: T[], options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.reset(formState, options);
  }

  get typedValueChanges(): Observable<T[]> {
    return this.valueChanges;
  }
}
