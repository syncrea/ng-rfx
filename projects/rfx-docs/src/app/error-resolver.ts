import {deepGet, ErrorMessages} from 'rfx-lib';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {allErrorMessages} from './error-messages';

export function resolveErrors(errors: ValidationErrors,
                              path: string[],
                              errorMessages: ErrorMessages = {},
                              pathPrefix: string[] = []): string[] | null {
  if (!errors) {
    return null;
  }

  const normalizedPath = path.filter(pathElement => !(/^[\d\s]+$/g.test(pathElement)));
  return Object.keys(errors)
    .reduce((messages, validatorName) => {
      const wholePath = [...pathPrefix, ...normalizedPath];
      let resolvedMessage = deepGet(errorMessages, [...wholePath, validatorName]);
      if (typeof resolvedMessage === 'object') {
        const parentSearchPath = [...wholePath];
        while (typeof resolvedMessage === 'object' && parentSearchPath.length > 0) {
          parentSearchPath.pop();
          resolvedMessage = deepGet(errorMessages, [...parentSearchPath, validatorName]);
        }

        if (typeof resolvedMessage === 'object') {
          resolvedMessage = validatorName;
        }
      }
      if (messages.indexOf(resolvedMessage) === -1) {
        messages.push(resolvedMessage);
      }
      return messages;
    }, <string[]>[]);
}

export const errorResolver = (control: AbstractControl, controlPath: string[]) =>
  !control.errors ? null : resolveErrors(
    control.errors,
    controlPath,
    allErrorMessages
  );
