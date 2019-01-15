import {FormRegistryKey} from './model';

export function noStoreError() {
  throw new Error(
    `No store detected. Make sure you've included @ngrx/store in your application.`
  );
}

export function noFormGroupError() {
  throw new Error(
    `rxfConnectForm needs to be placed on an element which also contains a formGroup directive.`
  );
}

export function noStoreFormBinding(path: string) {
  throw new Error(
    `No binding found for form state on path '${path}'.`
  );
}

export function noRegisteredFormForPath(path: string) {
  throw new Error(
    `No registered form found for path '${path}'.`
  );
}

export function noRegisteredFormForKeyAndNoFormDefinition(key: FormRegistryKey<any>) {
  throw new Error(
    `No registered form found for key ${JSON.stringify(key)} and no form definition present to create form. Pass a key for an existing form or a valid form definition so that the form can be created within the binding.`
  );
}
