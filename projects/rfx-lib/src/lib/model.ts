import { AbstractControlOptions, ValidationErrors } from '@angular/forms';
import { TypedFormArray, TypedFormControl, TypedFormGroup } from './forms/typed-form-control';
import { Observable } from 'rxjs';

export type PrimitiveType = string | number | boolean | undefined | null;

export type FormDefinitionTypeLiteral = 'Field' | 'CustomField' | 'Group' | 'GroupArray' | 'PrimitiveArray';

export interface TypedFormControlBase {
  readonly errors: ValidationErrors | null;
  readonly parentTypedControl: TypedFormControlBase | null;
  readonly formDefinition?: FormDefinition<unknown>;
  readonly typedValue: unknown;
  readonly typedValueChanges: Observable<unknown>;
  readonly errorsWithAliasPath: ValidationErrors | null;
}

export type MapperFn<T> = (val?: T | null) => T;

export type MapperOptions<T> =
  T extends string ? 'string' | MapperFn<string> :
    T extends number ? 'number' | MapperFn<number> :
      T extends boolean ? 'boolean' | MapperFn<boolean> :
        T extends string[] ? 'string[]' | MapperFn<string[]> :
          T extends number[] ? 'number[]' | MapperFn<number[]> :
            T extends boolean[] ? 'boolean[]' | MapperFn<boolean[]> :
        'string' | 'number' | 'boolean' | MapperFn<T> | MapperFn<PrimitiveType> |
              'string[]' | 'number[]' | 'boolean[]' | MapperFn<T[]> | MapperFn<PrimitiveType[]>;

export interface MappingControlOptions<T> extends AbstractControlOptions {
  readonly mapper?: MapperOptions<T>;
}

export interface FormDefinitionBase<T> {
  readonly type: FormDefinitionTypeLiteral;
  readonly options?: MappingControlOptions<T>;
  readonly alias?: string;
}

export interface FormDefinitionField<T> extends FormDefinitionBase<T> {
  readonly type: 'Field';
  readonly initialValue: T;
}

export interface FormDefinitionCustomField<T> extends FormDefinitionBase<T> {
  readonly type: 'CustomField';
  readonly initialValue: T;
}

export type FormDefinitionInfer<T> =
  T extends PrimitiveType ? FormDefinitionField<T> | T :
    T extends (infer E)[] ? E extends PrimitiveType ? FormDefinitionPrimitiveArray<E> | T : FormDefinitionGroupArray<E> :
      FormDefinitionGroup<T> | FormDefinitionCustomField<T>;

export type FormDefinitionFields<F> = {
  [K in keyof F]: FormDefinitionInfer<F[K]>;
};

export interface FormDefinitionGroup<F> extends FormDefinitionBase<F> {
  readonly type: 'Group';
  readonly fields: FormDefinitionFields<F>;
}

export interface FormDefinitionPrimitiveArray<T> extends FormDefinitionBase<T[]> {
  readonly type: 'PrimitiveArray';
  readonly initialValue?: T[];
}

export interface FormDefinitionGroupArray<F> extends FormDefinitionBase<F[]> {
  readonly type: 'GroupArray';
  readonly group: FormDefinitionGroup<F>;
  readonly initialItems?: number;
}

export type FormDefinition<T> =
  FormDefinitionField<T> |
  FormDefinitionCustomField<T> |
  FormDefinitionGroup<T> |
  FormDefinitionPrimitiveArray<T> |
  FormDefinitionGroupArray<T>;

export type TypedFormControlInfer<T> =
  T extends PrimitiveType ? TypedFormControl<T> :
    T extends (infer E)[] ? TypedFormArray<E> :
      TypedFormGroup<T>;

export interface TypedFormRegistryKey<T> {
  id: string;
}

export type FormRegistryKey<T> = TypedFormRegistryKey<T> | string;

export type InitialFormData<T> = T extends (infer E)[] ? Partial<E>[] : Partial<T>;
