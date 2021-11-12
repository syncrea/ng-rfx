import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { deepEquals, normalizeKey, uuid } from '../helper';
import { FormDefinitionAny, FormRegistryKey, InitialFormData, TypedFormControlInfer, TypedFormRegistryKey } from '../model';
import { createForm } from './form-creation';

export interface FormRegistryEntry<T> {
  form: TypedFormControlInfer<T>;
  formDefinition?: FormDefinitionAny<T>;
}

export interface FormCreationOptions<T> {
  key?: FormRegistryKey<T>;
  initialData?: InitialFormData<T>;
}

@Injectable({
  providedIn: 'root'
})
export class FormRegistry {
  private forms: {[id: string]: FormRegistryEntry<any>} = {};

  createOrNormalizeFormKey<T>(key?: FormRegistryKey<T>): TypedFormRegistryKey<T> {
    return key ? normalizeKey(key) : {id: uuid()};
  }

  createAndRegisterForm<T>(formDefinition: FormDefinitionAny<T>, options?: FormCreationOptions<T>): FormRegistryKey<T> {
    let normalizedKey: FormRegistryKey<T> | null = null;
    if (options && options.key) {
      normalizedKey = normalizeKey(options.key);
    }

    if (normalizedKey && this.forms[normalizedKey.id]) {
      return normalizedKey;
    } else if (!normalizedKey) {
      normalizedKey = {id: uuid()};
    }

    this.forms[normalizedKey.id] = {
      form: createForm<T>(formDefinition),
      formDefinition
    };
    if (options && options.initialData) {
      (<any>this.forms[normalizedKey.id].form.patchValue)(options.initialData);
    }
    return normalizedKey;
  }

  registerForm<T>(form: TypedFormControlInfer<T>, key?: FormRegistryKey<T>): FormRegistryKey<T> {
    const existingOrNewKey = this.createOrNormalizeFormKey(key);

    this.forms[existingOrNewKey.id] = {
      form
    };
    return existingOrNewKey;
  }

  getForm<T>(key: FormRegistryKey<T>): TypedFormControlInfer<T> | null  {
    key = normalizeKey(key);
    if (!key || !this.forms[key.id]) {
      return null;
    }

    return this.forms[key.id].form as TypedFormControlInfer<T>;
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

  observeForm<T>(key: FormRegistryKey<T>): Observable<T> | null {
    const normalizedKey = normalizeKey(key);
    if (!normalizedKey || !this.forms[normalizedKey.id]) {
      return null;
    }

    const entry = this.forms[normalizedKey.id];
    return merge(
      entry.form.valueChanges.pipe(map(() => entry.form.value)),
      entry.form.statusChanges.pipe(map(() => entry.form.value))
    ).pipe(
      startWith(entry.form.value),
      distinctUntilChanged((x, y) => deepEquals(x, y))
    );
  }
}
