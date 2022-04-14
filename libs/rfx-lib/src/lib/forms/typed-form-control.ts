import {PrimitiveType, FormDefinitionAny, TypedFormControlBase} from '../model';
import {AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {map} from 'rxjs/operators';
import { extractErrorsWithAliasPrefix } from '../helper';

export class TypedFormControl<T> extends FormControl implements TypedFormControlBase {
  constructor(formState?: T, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, public readonly formDefinition?: FormDefinitionAny<T>) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  get typedValue(): T {
    return this.value;
  }

  get typedValueChanges(): Observable<T> {
    return this.valueChanges;
  }

  get errorsWithAliasPath(): ValidationErrors | null {
    return extractErrorsWithAliasPrefix(this);
  }

  get parentTypedControl(): TypedFormControlBase {
    return this.parent as unknown as TypedFormControlBase;
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

export class TypedFormGroup<F> extends FormGroup implements TypedFormControlBase {
  constructor(controls: TypedFormGroupControlsInternal<F>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, public readonly formDefinition?: FormDefinitionAny<F>) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  get typedValue(): F {
    return this.value;
  }

  get typedRawValue(): F {
    return this.getRawValue();
  }

  get typedValueChanges(): Observable<F> {
    return this.valueChanges;
  }

  get typedRawValueChanges(): Observable<F> {
    return this.valueChanges.pipe(map(() => this.typedRawValue));
  }

  get typedControls(): TypedFormGroupControlsInternal<F> {
    return <TypedFormGroupControlsInternal<F>>this.controls;
  }

  get errorsWithAliasPath(): ValidationErrors | null {
    return extractErrorsWithAliasPrefix(this);
  }

  get parentTypedControl(): TypedFormControlBase {
    return this.parent as unknown as TypedFormControlBase;
  }

  typedGet<K extends keyof F>(key: K): TypedFormGroupChildInternal<F, K> {
    const childControl = super.get(<string>key);
    return <TypedFormGroupChildInternal<F, K>>childControl;
  }

  typedGetCustomField<K extends keyof F>(key: K): TypedFormControl<F[K]> {
    const childControl = super.get(<string>key);
    return <TypedFormControl<F[K]>>childControl;
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

export class TypedFormArray<T> extends FormArray implements TypedFormControlBase {
  constructor(controls: TypedFormControlOrGroupArrayInternal<T>[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, public readonly formDefinition?: FormDefinitionAny<T>) {
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

  get typedControlsCustomField(): TypedFormControl<T>[] {
    return <TypedFormControl<T>[]>this.controls;
  }

  get typedValueChanges(): Observable<T[]> {
    return this.valueChanges;
  }

  get typedRawValueChanges(): Observable<T[]> {
    return this.valueChanges.pipe(map(() => this.typedRawValue));
  }

  get errorsWithAliasPath(): ValidationErrors | null {
    return extractErrorsWithAliasPrefix(this);
  }

  get parentTypedControl(): TypedFormControlBase {
    return this.parent as unknown as TypedFormControlBase;
  }

  typedAt(index: number): TypedFormControlOrGroupArrayInternal<T> | null {
    const childControl = super.at(index);
    if (childControl instanceof TypedFormControl || childControl instanceof TypedFormGroup) {
      return <any>childControl;
    } else {
      return null;
    }
  }

  typedAtCustomField(index: number): TypedFormControl<T> | null {
    return <any>this.typedAt(index);
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
