import {
  FormDefinition,
  FormDefinitionField,
  FormDefinitionGroup,
  FormDefinitionGroupArray,
  FormDefinitionPrimitiveArray,
  PrimitiveType,
  TypedFormControlInfer
} from '../model';
import {TypedFormArray, TypedFormControl, TypedFormGroup} from './typed-form-control';
import {isPrimitiveListType, isPrimitiveType} from '../helper';

export function createForm<T extends PrimitiveType>(initialValue: T | FormDefinitionField<T>): TypedFormControl<T>;
export function createForm<T extends PrimitiveType[]>(initialValue: T | FormDefinitionPrimitiveArray<T[0]>): TypedFormArray<T[0]>;
export function createForm<T>(formDefinition: FormDefinitionGroupArray<T>): TypedFormArray<T>;
export function createForm<T>(formDefinition: FormDefinitionGroup<T>): TypedFormGroup<T>;
export function createForm<T>(formDefinitionOrInitialValue: FormDefinition<T> | PrimitiveType | PrimitiveType[]): TypedFormControlInfer<any>;
export function createForm<T>(formDefinitionOrInitialValue: FormDefinition<T> | PrimitiveType | PrimitiveType[]): TypedFormControlInfer<any> {
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
  } else if (formDefinitionOrInitialValue.type === 'Field') {
    return new TypedFormControl(formDefinitionOrInitialValue.initialValue, formDefinitionOrInitialValue.options);
  } else if (formDefinitionOrInitialValue.type === 'Group') {
    const controls = Object.keys(formDefinitionOrInitialValue.fields).reduce((fieldControls, fieldName) => {
      fieldControls[fieldName] = createForm((<any>formDefinitionOrInitialValue.fields)[fieldName]);
      return fieldControls;
    }, <any>{});
    return new TypedFormGroup(controls, formDefinitionOrInitialValue.options);
  } else if (formDefinitionOrInitialValue.type === 'PrimitiveArray') {
    const controls = (formDefinitionOrInitialValue.initialValue || []).map(initialValue => createForm(<any>initialValue));
    return new TypedFormArray(controls, formDefinitionOrInitialValue.options);
  } else if (formDefinitionOrInitialValue.type === 'GroupArray') {
    const controls = Array.from({length: formDefinitionOrInitialValue.initialItems || 0}).map(() => createForm(formDefinitionOrInitialValue.group));
    return new TypedFormArray(<any>controls, formDefinitionOrInitialValue.options);
  } else {
    throw new Error(`Invalid form definition or initial value ${formDefinitionOrInitialValue}`);
  }
}

export function pushFormGroupArrayItem<F>(formArrayDefinition: FormDefinitionGroupArray<F>, formArray: TypedFormArray<F>, value?: F): TypedFormArray<F> {
  const formControl = createForm(formArrayDefinition.group);
  if (value) {
    formControl.setValue(value);
  }
  formArray.push(formControl);
  return formArray;
}
