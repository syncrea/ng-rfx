import {InjectionToken} from '@angular/core';
import {ErrorMessageResolver} from './model';

export const RFX_ERROR_RESOLVER = new InjectionToken<ErrorMessageResolver>('[rfx] Error Resolver');
