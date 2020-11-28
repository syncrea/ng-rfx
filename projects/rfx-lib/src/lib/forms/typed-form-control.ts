import { FormDefinition, MapperFn, MappingControlOptions, PrimitiveType, TypedFormControlBase } from '../model';
import { AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { extractErrorsWithAliasPrefix, getMapper } from '../helper';

export class TypedFormControl<T> extends FormControl implements TypedFormControlBase {
  private readonly mapper: MapperFn<T>;

  constructor(formState?: T, validatorOrOpts?: ValidatorFn | ValidatorFn[] | MappingControlOptions<T> | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, public readonly formDefinition?: FormDefinition<T>) {
    super(formState, validatorOrOpts, asyncValidator);
    const mapperOpts = validatorOrOpts && (validatorOrOpts as MappingControlOptions<T>).mapper;
    if (mapperOpts) {
      this.mapper = getMapper(mapperOpts);
    }
  }

  get typedValue(): T {
    if (this.mapper) {
      return this.mapper(this.value);
    }
    return this.value;
  }

  get typedValueChanges(): Observable<T> {
    if (this.mapper) {
      return this.valueChanges.pipe(map(value => this.mapper(value)));
    }
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

  private emitIfRequired(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    if (opts.emitEvent !== false) {
      (<EventEmitter<any>>this.statusChanges).emit(this.status);
    }
  }

  markAsTouched(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsTouched({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsUntouched(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsUntouched({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsDirty(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsDirty({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsPristine(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsPristine({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }
}

type TypedFormGroupChildInternal<F, K extends keyof F> =
  F[K] extends PrimitiveType ? TypedFormControl<F[K]> :
    F[K] extends (infer E)[] ? TypedFormArray<E> : TypedFormGroup<F[K]>;
type TypedFormGroupControlsInternal<F> = { [K in keyof F]: TypedFormGroupChildInternal<F, K> };

export class TypedFormGroup<F> extends FormGroup implements TypedFormControlBase {
  private readonly mapper: MapperFn<F>;

  constructor(controls: TypedFormGroupControlsInternal<F>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | MappingControlOptions<F> | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, public readonly formDefinition?: FormDefinition<F>) {
    super(controls, validatorOrOpts, asyncValidator);
    const mapperOpts = validatorOrOpts && (validatorOrOpts as MappingControlOptions<F>).mapper;
    if (mapperOpts) {
      this.mapper = getMapper(mapperOpts);
    }
  }

  get typedValue(): F {
    if (this.mapper) {
      return this.mapper(this.value);
    }
    return this.value;
  }

  get typedRawValue(): F {
    if (this.mapper) {
      return this.mapper(this.getRawValue());
    }
    return this.getRawValue();
  }

  get typedValueChanges(): Observable<F> {
    if (this.mapper) {
      return this.valueChanges.pipe(map(value => this.mapper(value)));
    }
    return this.valueChanges;
  }

  get typedRawValueChanges(): Observable<F> {
    if (this.mapper) {
      return this.valueChanges.pipe(map(() => this.mapper(this.typedRawValue)));
    }
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

  private emitIfRequired(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    if (opts.emitEvent !== false) {
      (<EventEmitter<any>>this.statusChanges).emit(this.status);
    }
  }

  markAsTouched(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsTouched({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsUntouched(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsUntouched({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsDirty(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsDirty({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsPristine(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsPristine({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }
}

type TypedFormControlOrGroupArrayInternal<T> = T extends PrimitiveType ? TypedFormControl<T> : TypedFormGroup<T>;

export class TypedFormArray<T> extends FormArray implements TypedFormControlBase {
  private readonly mapper: MapperFn<T[]>;

  constructor(controls: TypedFormControlOrGroupArrayInternal<T>[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | MappingControlOptions<T[]> | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null, public readonly formDefinition?: FormDefinition<T>) {
    super(controls, validatorOrOpts, asyncValidator);
    const mapperOpts = validatorOrOpts && (validatorOrOpts as MappingControlOptions<T[]>).mapper;
    if (mapperOpts) {
      this.mapper = getMapper(mapperOpts);
    }
  }

  get typedValue(): T[] {
    if (this.mapper) {
      return this.mapper(this.value);
    }
    return this.value;
  }

  get typedRawValue(): T[] {
    if (this.mapper) {
      return this.mapper(this.getRawValue());
    }
    return this.getRawValue();
  }

  get typedValueChanges(): Observable<T[]> {
    if (this.mapper) {
      return this.valueChanges.pipe(map(value => this.mapper(value)));
    }
    return this.valueChanges;
  }

  get typedRawValueChanges(): Observable<T[]> {
    if (this.mapper) {
      return this.valueChanges.pipe(map(() => this.mapper(this.typedRawValue)));
    }
    return this.valueChanges.pipe(map(() => this.typedRawValue));
  }

  get typedControls(): TypedFormControlOrGroupArrayInternal<T>[] {
    return <TypedFormControlOrGroupArrayInternal<T>[]>this.controls;
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

  private emitIfRequired(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    if (opts.emitEvent !== false) {
      (<EventEmitter<any>>this.statusChanges).emit(this.status);
    }
  }

  markAsTouched(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsTouched({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsUntouched(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsUntouched({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsDirty(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsDirty({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }

  markAsPristine(opts: { onlySelf?: boolean, emitEvent?: boolean } = {}): void {
    super.markAsPristine({ onlySelf: opts.onlySelf });
    this.emitIfRequired(opts);
  }
}
