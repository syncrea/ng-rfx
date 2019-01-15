import {
  ErrorMessageResolver,
  FormState,
  FormStateArray,
  FormStateControl,
  FormStateControlBase,
  FormStateGroup,
  FormStateGroupFields
} from '../model';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {TypedFormArray, TypedFormControl, TypedFormGroup} from './typed-form-control';

export function extractStateBase(control: AbstractControl): FormStateControlBase {
  return {
    dirty: control.dirty,
    invalid: control.invalid,
    pending: control.pending,
    pristine: control.pristine,
    touched: control.touched,
    untouched: control.untouched,
    valid: control.valid,
    disabled: control.disabled,
    enabled: control.enabled
  };
}

export function getFormState<F>(control: TypedFormControl<F>,
                                errorResolver?: ErrorMessageResolver,
                                errorPathPrefix?: string): FormStateControl<F>;
export function getFormState<F>(control: TypedFormGroup<F>,
                                errorResolver?: ErrorMessageResolver,
                                errorPathPrefix?: string): FormStateGroup<F>;
export function getFormState<E>(control: TypedFormArray<E>,
                                errorResolver?: ErrorMessageResolver,
                                errorPathPrefix?: string): FormStateArray<E>;
export function getFormState<F>(control: AbstractControl,
                                errorResolver?: ErrorMessageResolver,
                                errorPathPrefix?: string): FormState<F>;
export function getFormState<F>(control: AbstractControl,
                                errorResolver?: ErrorMessageResolver,
                                errorPathPrefix?: string): FormState<F> {
  return <FormState<F>>getFormStateRecursive(control, errorResolver || (() => null), errorPathPrefix ? [errorPathPrefix] : []);
}

function getFormStateRecursive(control: AbstractControl,
                               errorResolver: ErrorMessageResolver,
                               path: string[]): FormState<any> {
  if (control instanceof FormGroup) {
    return getFormGroupState(control, errorResolver, path);
  } else if (control instanceof FormArray) {
    return getFormArrayState(control, errorResolver, path);
  } else if (control instanceof FormControl) {
    return getFormControlState(control, errorResolver, path);
  }
}

export function getFormGroupState<F>(group: TypedFormGroup<F> | FormGroup, errorResolver: ErrorMessageResolver, path: string[]): FormStateGroup<F>;
export function getFormGroupState<F>(group: FormGroup, errorResolver: ErrorMessageResolver, path: string[]): FormStateGroup<F> {
  const fields: FormStateGroupFields<F> = Object.keys(group.controls)
    .map(key => ({
      name: key,
      state: getFormStateRecursive(group.controls[key], errorResolver, [...path, key])
    }))
    .reduce((reducedFields: FormStateGroupFields<F>, entry) => {
      reducedFields[entry.name] = entry.state;
      return reducedFields;
    }, <FormStateGroupFields<F>>{});

  return {
    ...extractStateBase(group),
    value: group.value,
    fields,
    errors: errorResolver(group, path)
  };
}

export function getFormArrayState<E>(array: TypedFormArray<E> | FormArray, errorResolver: ErrorMessageResolver, path: string[]): FormStateArray<E>;
export function getFormArrayState<E>(array: FormArray, errorResolver: ErrorMessageResolver, path: string[]): FormStateArray<E> {
  return {
    ...extractStateBase(array),
    value: <E[]>array.value,
    items: <FormState<E>[]>array.controls.map((subControl, index) => getFormStateRecursive(subControl, errorResolver, [...path, `${index}`])),
    errors: errorResolver(array, path)
  };
}

export function getFormControlState<T>(control: TypedFormControl<T> | FormControl, errorResolver: ErrorMessageResolver, path: string[]): FormStateControl<T>;
export function getFormControlState<T>(control: FormControl, errorResolver: ErrorMessageResolver, path: string[]): FormStateControl<T> {
  return {
    ...extractStateBase(control),
    value: <T>control.value,
    errors: errorResolver(control, path)
  };
}
