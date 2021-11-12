import {FormRegistryKey} from './model';
import {normalizeKey} from './helper';

export function noRegisteredFormForKeyAndNoFormDefinition(key: FormRegistryKey<any>) {
  const normalizedKey = normalizeKey(key);
  if (!normalizedKey) {
    throw new Error(
      `Invalid registry key found ${key}.`
    );
  } else {
    throw new Error(
      `No registered form found for key {id:'${normalizeKey(key).id}'} and no form definition present to create form. Pass a key for an existing form or a valid form definition so that the form can be created within the binding.`
    );
  }
}
