import {Inject, Injectable, Optional} from '@angular/core';
import {merge, Observable} from 'rxjs';
import {distinctUntilChanged, map, startWith} from 'rxjs/operators';
import {ErrorMessageResolver, FormData, FormDefinition, FormRegistryKey, InitialFormData, TypedFormControlType} from '../model';
import {getFormState} from './form-state';
import {RFX_ERROR_RESOLVER} from '../tokens';
import {createForm} from './form-creation';
import {deepEquals, normalizeKey, uuid} from '../helper';
import {AbstractControl} from '@angular/forms';

const defaultErrorResolver: ErrorMessageResolver = (control: AbstractControl, path: string[]) => control.errors ? Object.keys(control.errors) : null;

export interface FormRegistryEntry<T> {
  form: TypedFormControlType<T>;
  formDefinition?: FormDefinition<T>;
}

@Injectable({
  providedIn: 'root'
})
export class FormRegistryService {
  private forms: {[id: string]: FormRegistryEntry<any>} = {};

  constructor(@Inject(RFX_ERROR_RESOLVER) @Optional() private errorResolver: ErrorMessageResolver) {}

  createAndRegisterForm<T>(formDefinition: FormDefinition<T>, options?: {
    key?: FormRegistryKey<T>,
    initialData?: InitialFormData<T>
  }): FormRegistryKey<T> {
    let key = normalizeKey(options && options.key);

    if (key && this.forms[key.id]) {
      return key;
    } else if (!key) {
      key = {id: uuid()};
    }

    this.forms[key.id] = {
      form: createForm<T>(formDefinition),
      formDefinition
    };
    if (options && options.initialData) {
      (<any>this.forms[key.id].form.setValue)(options.initialData);
    }
    return key;
  }

  registerForm<T>(form: TypedFormControlType<T>, key?: FormRegistryKey<T>): FormRegistryKey<T> {
    key = normalizeKey(key);

    if (key && this.forms[key.id]) {
      return key;
    } else if (!key) {
      key = {id: uuid()};
    }

    this.forms[key.id] = {
      form
    };
    return key;
  }

  getForm<T>(key: FormRegistryKey<T>): TypedFormControlType<T> | null  {
    key = normalizeKey(key);
    if (!key || !this.forms[key.id]) {
      return null;
    }

    return <TypedFormControlType<T>>this.forms[key.id].form;
  }

  getFormData<T>(key: FormRegistryKey<T>): FormData<T> | null  {
    key = normalizeKey(key);
    if (!key || !this.forms[key.id]) {
      return null;
    }

    return {
      control: <TypedFormControlType<T>>this.forms[key.id].form,
      state: getFormState(this.forms[key.id].form)
    };
  }

  removeForm(key: FormRegistryKey<any>): boolean {
    key = normalizeKey(key);
    if (key && this.forms[key.id]) {
      delete this.forms[key.id];
      return true;
    } else {
      return false;
    }
  }

  containsForm(key: FormRegistryKey<any>): boolean {
    key = normalizeKey(key);
    return !!this.forms[key.id];
  }

  observeForm<T>(key: FormRegistryKey<T>): Observable<FormData<T>> | null {
    const normalizedKey = normalizeKey(key);
    if (!normalizedKey || !this.forms[normalizedKey.id]) {
      return null;
    }

    const entry = this.forms[normalizedKey.id];
    const control = <TypedFormControlType<T>>entry.form;
    return merge(
      control.valueChanges.pipe(map(() => getFormState(control))),
      control.statusChanges.pipe(map(() => getFormState(control)))
    ).pipe(
      startWith(true),
      distinctUntilChanged((x, y) => deepEquals(x, y)),
      map(() => ({
        state: getFormState<T>(control, this.errorResolver || defaultErrorResolver, entry.formDefinition && entry.formDefinition.alias),
        control
      }))
    );
  }
}
