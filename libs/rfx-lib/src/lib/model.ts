import { AbstractControl, AbstractControlOptions, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { TypedFormArray, TypedFormControl, TypedFormGroup } from './forms/typed-form-control';
import { Observable } from 'rxjs';

export type PrimitiveType = string | number | boolean | undefined | null;

export type FormDefinitionTypeLiteral = 'Field' | 'CustomField' | 'Group' | 'GroupArray' | 'PrimitiveArray';

export interface TypedFormControlBase {
  readonly errors: ValidationErrors | null;
  readonly parentTypedControl: TypedFormControlBase | null;
  readonly formDefinition?: FormDefinitionAny<unknown>;
  readonly typedValue: unknown;
  readonly typedValueChanges: Observable<unknown>;
  readonly errorsWithAliasPath: ValidationErrors | null;
}

export interface FormDefinitionBase {
  readonly type: FormDefinitionTypeLiteral;
  readonly options?: AbstractControlOptions;
  readonly alias?: string;
}

export interface FormDefinitionField<T> extends FormDefinitionBase {
  readonly type: 'Field';
  readonly initialValue: T;
}

export interface FormDefinitionCustomField<T> extends FormDefinitionBase {
  readonly type: 'CustomField';
  readonly initialValue: T;
}

export type FormDefinition<T> =
  T extends PrimitiveType ? FormDefinitionField<T> | T :
    T extends (infer E)[] ? E extends PrimitiveType ? FormDefinitionPrimitiveArray<E> | T | FormDefinitionCustomField<T> : FormDefinitionGroupArray<E> | FormDefinitionCustomField<T> :
      FormDefinitionGroup<T> | FormDefinitionCustomField<T>;

export type FormDefinitionFields<F> = {
  [K in keyof F]: FormDefinition<F[K]>;
};

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

export type FormDefinitionAny<T> =
  FormDefinitionField<T> |
  FormDefinitionCustomField<T> |
  FormDefinitionGroup<T> |
  FormDefinitionPrimitiveArray<T> |
  FormDefinitionGroupArray<T>;

export type TypedFormControlInfer<T> =
  T extends PrimitiveType ? TypedFormControl<T> :
    T extends (infer E)[] ? TypedFormArray<E> :
      TypedFormGroup<T>;

export type NativeFormControlInfer<T> =
  T extends PrimitiveType ? FormControl<T> :
    T extends (infer E)[] ? FormArray<AbstractControl<E>> :
      FormGroup<{[K in keyof T]: NativeFormControlInfer<T[K]>}>;

const f: FormGroup<{a: FormControl<string>}> = {} as any;

export interface TypedFormRegistryKey<T> {
  id: string;
}

export type FormRegistryKey<T> = TypedFormRegistryKey<T> | string;

export type InitialFormData<T> = T extends (infer E)[] ? Partial<E>[] : Partial<T>;
