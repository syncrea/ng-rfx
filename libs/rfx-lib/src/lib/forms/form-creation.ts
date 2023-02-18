import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { isPrimitiveListType, isPrimitiveType, raiseError } from '../helper';
import {
  FormDefinitionAny, FormDefinitionCustomField, FormDefinitionField,
  FormDefinitionGroup,
  FormDefinitionGroupArray,
  FormDefinitionPrimitiveArray,
  NativeFormControlInfer,
  PrimitiveType, TypedFormControlInfer
} from '../model';
import { TypedFormArray, TypedFormControl, TypedFormGroup } from './typed-form-control';

export function createForm<T extends PrimitiveType>(initialValue: T | FormDefinitionField<T>): TypedFormControl<T>;
export function createForm<T extends PrimitiveType[]>(initialValue: T | FormDefinitionPrimitiveArray<T[0]>): TypedFormArray<T[0]>;
export function createForm<T>(formDefinition: FormDefinitionGroupArray<T>): TypedFormArray<T>;
export function createForm<T>(formDefinition: FormDefinitionGroup<T>): TypedFormGroup<T>;
export function createForm<T>(formDefinitionOrInitialValue: FormDefinitionAny<T> | PrimitiveType | PrimitiveType[]): TypedFormControlInfer<any>;
export function createForm<T>(formDefinitionOrInitialValue: FormDefinitionAny<T> | PrimitiveType | PrimitiveType[]): TypedFormControlInfer<any> {
  if (isPrimitiveType(formDefinitionOrInitialValue)) {
    return createForm({
      type: 'Field',
      initialValue: formDefinitionOrInitialValue
    });
  } else if (isPrimitiveListType(formDefinitionOrInitialValue)) {
    return <any>createForm({
      type: 'PrimitiveArray',
      initialValue: formDefinitionOrInitialValue
    });
  } else if (formDefinitionOrInitialValue.type === 'Field' || formDefinitionOrInitialValue.type === 'CustomField') {
    return new TypedFormControl(formDefinitionOrInitialValue.initialValue, formDefinitionOrInitialValue.options, undefined, !isPrimitiveType(formDefinitionOrInitialValue) ? formDefinitionOrInitialValue : undefined);
  } else if (formDefinitionOrInitialValue.type === 'Group') {
    const controls = Object.keys(formDefinitionOrInitialValue.fields).reduce((fieldControls, fieldName) => {
      fieldControls[fieldName] = createForm((<any>formDefinitionOrInitialValue.fields)[fieldName]);
      return fieldControls;
    }, <any>{});
    return new TypedFormGroup(controls, formDefinitionOrInitialValue.options, undefined, formDefinitionOrInitialValue);
  } else if (formDefinitionOrInitialValue.type === 'PrimitiveArray') {
    const controls = (formDefinitionOrInitialValue.initialValue || []).map(initialValue => createForm(<any>initialValue));
    return new TypedFormArray(controls, formDefinitionOrInitialValue.options, undefined, !isPrimitiveListType(formDefinitionOrInitialValue) ? formDefinitionOrInitialValue : undefined);
  } else if (formDefinitionOrInitialValue.type === 'GroupArray') {
    const controls = Array.from({length: formDefinitionOrInitialValue.initialItems || 0}).map(() => createForm(formDefinitionOrInitialValue.group));
    return new TypedFormArray(<any>controls, formDefinitionOrInitialValue.options, undefined, formDefinitionOrInitialValue);
  } else {
    throw new Error(`Invalid form definition or initial value ${formDefinitionOrInitialValue}`);
  }
}

export function createNativeForm<T extends PrimitiveType>(initialValue: T | FormDefinitionField<T>): NativeFormControlInfer<T>;
export function createNativeForm<T extends PrimitiveType[]>(initialValue: T | FormDefinitionPrimitiveArray<T[0]>): NativeFormControlInfer<T>;
export function createNativeForm<T>(formDefinition: FormDefinitionGroupArray<T>): NativeFormControlInfer<T[]>;
export function createNativeForm<T extends {[k: string]: any}>(formDefinition: FormDefinitionGroup<T>): NativeFormControlInfer<T>;
export function createNativeForm<T>(formDefinitionOrInitialValue: FormDefinitionAny<T> | PrimitiveType | PrimitiveType[]): AbstractControl<any>;
export function createNativeForm<T>(formDefinitionOrInitialValue: FormDefinitionAny<T> | PrimitiveType | PrimitiveType[]): AbstractControl<any> {
  if (isPrimitiveType(formDefinitionOrInitialValue)) {
    return createNativeForm({
      type: 'Field',
      initialValue: formDefinitionOrInitialValue
    });
  } else if (isPrimitiveListType(formDefinitionOrInitialValue)) {
    return createNativeForm({
      type: 'PrimitiveArray',
      initialValue: formDefinitionOrInitialValue
    });
  } else if (formDefinitionOrInitialValue.type === 'Field' || formDefinitionOrInitialValue.type === 'CustomField') {
    return new FormControl(formDefinitionOrInitialValue.initialValue, formDefinitionOrInitialValue.options);
  } else if (formDefinitionOrInitialValue.type === 'Group') {
    const controls = Object.keys(formDefinitionOrInitialValue.fields).reduce((fieldControls, fieldName) => {
      fieldControls[fieldName] = createNativeForm((<any>formDefinitionOrInitialValue.fields)[fieldName]);
      return fieldControls;
    }, {} as {[k: string]: any});
    return new FormGroup(controls, formDefinitionOrInitialValue.options);
  } else if (formDefinitionOrInitialValue.type === 'PrimitiveArray') {
    const controls = (formDefinitionOrInitialValue.initialValue || []).map(initialValue => createNativeForm(<any>initialValue));
    return new FormArray(controls, formDefinitionOrInitialValue.options);
  } else if (formDefinitionOrInitialValue.type === 'GroupArray') {
    const controls = Array.from({length: formDefinitionOrInitialValue.initialItems || 0}).map(() => createNativeForm(formDefinitionOrInitialValue.group));
    return new FormArray(controls, formDefinitionOrInitialValue.options, undefined);
  } else {
    throw new Error(`Invalid form definition or initial value ${formDefinitionOrInitialValue}`);
  }
}

export function pushFormGroupArrayItem<F>(
  formArrayDefinition: FormDefinitionGroupArray<F> | FormDefinitionCustomField<F[]>,
  formArray: TypedFormArray<F>,
  value?: F,
  options?: {
    emitEvent?: boolean;
  }
): TypedFormArray<F> {

  if (formArrayDefinition.type === 'CustomField') {
    raiseError(`Cannot use pushFormGroupArrayItem on TypedFormArray with definition of type 'CustomField'`);
  }

  const formControl = createForm(formArrayDefinition.group);
  if (value) {
    formControl.setValue(value);
  }
  formArray.push(formControl, options);
  return formArray;
}
