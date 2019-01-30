import {AbstractControl, AbstractControlOptions} from '@angular/forms';
import {TypedFormArray, TypedFormControl, TypedFormGroup} from './forms/typed-form-control';

export interface ErrorMessages {
  [k: string]: ErrorMessages | string;
}

export type ErrorMessageResolver = (control: AbstractControl, path: string[]) => string[] | null;

export type PrimitiveType = string | number | boolean | null;

export type FormDefinitionTypeLiteral = 'Field' | 'Group' | 'GroupArray' | 'PrimitiveArray';

export interface FormDefinitionBase {
  readonly type: FormDefinitionTypeLiteral;
  readonly options?: AbstractControlOptions;
  readonly alias?: string;
}

export interface FormDefinitionField<T> extends FormDefinitionBase {
  readonly type: 'Field';
  readonly initialValue: T;
}

export interface FormDefinitionGroup<F> extends FormDefinitionBase {
  readonly type: 'Group';
  readonly fields: FormDefinitionFields<F>;
}

export interface FormDefinitionPrimitiveArray<T> extends FormDefinitionBase {
  readonly type: 'PrimitiveArray';
  readonly initialValue?: T[];
}

export interface FormDefinitionGroupArray<F> extends FormDefinitionBase {
  readonly type: 'GroupArray';
  readonly group: FormDefinitionGroup<F>;
  readonly initialItems?: number;
}

export type FormDefinition<T> =
  FormDefinitionField<T> |
  FormDefinitionGroup<T> |
  FormDefinitionPrimitiveArray<T> |
  FormDefinitionGroupArray<T>;

export type FormDefinitionType<T> =
  T extends PrimitiveType ? FormDefinitionField<T> | T :
    T extends (infer E)[] ? E extends PrimitiveType ? FormDefinitionPrimitiveArray<E> | T : FormDefinitionGroupArray<E> :
      FormDefinitionGroup<T>;

export type FormDefinitionFields<F> = {
  [K in keyof F]: FormDefinitionType<F[K]>;
};

export interface FormStateControlBase {
  readonly untouched: boolean;
  readonly touched: boolean;
  readonly pristine: boolean;
  readonly dirty: boolean;
  readonly valid: boolean;
  readonly invalid: boolean;
  readonly pending: boolean;
  readonly disabled: boolean;
  readonly enabled: boolean;
  readonly errors?: string[];
}

export type FormStateGroupFields<F> = {
  [K in keyof F]: FormState<F[K]>;
};

export interface FormStateGroup<F> extends FormStateControlBase {
  readonly value: F;
  readonly fields: FormStateGroupFields<F>;
}

export interface FormStateArray<E> extends FormStateControlBase {
  readonly value: E[];
  readonly items: FormState<E>[];
}

export interface FormStateControl<T> extends FormStateControlBase {
  readonly value: T;
}

export type FormState<F> =
  F extends PrimitiveType ? FormStateControl<F> :
    F extends (infer E)[] ? FormStateArray<E> :
      FormStateGroup<F>;

export type TypedFormControlType<T> =
  T extends PrimitiveType ? TypedFormControl<T> :
    T extends any[] ? TypedFormArray<T[0]> :
      TypedFormGroup<T>;

export interface FormData<T> {
  state: FormState<T>;
  control: TypedFormControlType<T>;
}

export interface TypedFormRegistryKey<T> {
  id: string;
}

export type FormRegistryKey<T> = TypedFormRegistryKey<T> | string;

export type InitialFormData<T> = T extends (infer E)[] ? Partial<E>[] : Partial<T>;
