import {FormRegistryKey} from 'rfx-lib';
import {MainPersonForm, PersonForm, RegularPersonForm} from './dynamic-form.forms';

export type PersonType = 'Regular' | 'Main';

export interface PersonBase {
  readonly type: PersonType;
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly formKey: FormRegistryKey<PersonForm>;
}

export interface MainPerson extends PersonBase {
  readonly type: 'Main';
  readonly emailAddress: string;
  readonly formKey: FormRegistryKey<MainPersonForm>;
}

export interface RegularPerson extends PersonBase {
  readonly type: 'Regular';
  readonly formKey: FormRegistryKey<RegularPersonForm>;
}

export type Person = RegularPerson | MainPerson;
