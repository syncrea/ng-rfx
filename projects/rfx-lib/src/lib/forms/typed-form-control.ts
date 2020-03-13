import {PrimitiveType} from '../model';
import {AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {map} from 'rxjs/operators';

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

  private emitIfRequired(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}) {
    if (opts.emitEvent !== false) {
      (<EventEmitter<any>>this.statusChanges).emit(this.status);
    }
  }

  markAsTouched(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsTouched({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsUntouched(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsUntouched({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsDirty(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsDirty({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsPristine(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsPristine({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }
}

type TypedFormGroupChildInternal<F, K extends keyof F> =
  F[K] extends PrimitiveType ? TypedFormControl<F[K]> :
  F[K] extends (infer E)[] ? TypedFormArray<E> : TypedFormGroup<F[K]>;
type TypedFormGroupControlsInternal<F> = {[K in keyof F]: TypedFormGroupChildInternal<F, K>};

export class TypedFormGroup<F> extends FormGroup {
  constructor(controls: TypedFormGroupControlsInternal<F>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  get typedValue(): F {
    return this.value;
  }

  get typedRawValue(): F {
    return this.getRawValue();
  }

  get typedControls(): TypedFormGroupControlsInternal<F> {
    return <TypedFormGroupControlsInternal<F>>this.controls;
  }

  typedGet<K extends keyof F>(key: K): TypedFormGroupChildInternal<F, K> {
    const childControl = super.get(<string>key);
    return <TypedFormGroupChildInternal<F, K>>childControl;
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

  get typedRawValueChanges(): Observable<F> {
    return this.valueChanges.pipe(map(() => this.typedRawValue));
  }

  private emitIfRequired(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}) {
    if (opts.emitEvent !== false) {
      (<EventEmitter<any>>this.statusChanges).emit(this.status);
    }
  }

  markAsTouched(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsTouched({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsUntouched(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsUntouched({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsDirty(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsDirty({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsPristine(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsPristine({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }
}

type TypedFormControlOrGroupArrayInternal<T> = T extends PrimitiveType ? TypedFormControl<T> : TypedFormGroup<T>;

export class TypedFormArray<T> extends FormArray {
  constructor(controls: TypedFormControlOrGroupArrayInternal<T>[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  get typedValue(): T[] {
    return this.value;
  }

  get typedRawValue(): T[] {
    return this.getRawValue();
  }

  get typedControls(): TypedFormControlOrGroupArrayInternal<T>[] {
    return <TypedFormControlOrGroupArrayInternal<T>[]>this.controls;
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

  get typedRawValueChanges(): Observable<T[]> {
    return this.valueChanges.pipe(map(() => this.typedRawValue));
  }

  private emitIfRequired(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}) {
    if (opts.emitEvent !== false) {
      (<EventEmitter<any>>this.statusChanges).emit(this.status);
    }
  }

  markAsTouched(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsTouched({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsUntouched(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsUntouched({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsDirty(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsDirty({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }

  markAsPristine(opts: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    super.markAsPristine({onlySelf: opts.onlySelf});
    this.emitIfRequired(opts);
  }
}
