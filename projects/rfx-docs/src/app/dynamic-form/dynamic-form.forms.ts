import {FormDefinitionGroup} from 'rfx-lib';
import {Validators} from '@angular/forms';

export interface RegularPersonForm {
  readonly firstName: string;
  readonly lastName: string;
}

export interface MainPersonForm {
  readonly firstName: string;
  readonly lastName: string;
  readonly emailAddress: string;
}

export type PersonForm = RegularPersonForm | MainPersonForm;

export const regularPersonFormDefinition: FormDefinitionGroup<RegularPersonForm> = {
  type: 'Group',
  alias: 'regularPerson',
  fields: {
    firstName: {
      type: 'Field',
      initialValue: 'Initial first name',
      options: {
        validators: [Validators.required]
      }
    },
    lastName: 'Initial last name'
  }
};

export const mainPersonFormDefinition: FormDefinitionGroup<MainPersonForm> = {
  type: 'Group',
  alias: 'mainPerson',
  fields: {
    firstName: {
      type: 'Field',
      initialValue: 'Initial first name',
      options: {
        validators: [Validators.required]
      }
    },
    lastName: {
      type: 'Field',
      initialValue: 'Initial last name',
      options: {
        validators: [Validators.required]
      }
    },
    emailAddress: 'Initial email address'
  }
};
