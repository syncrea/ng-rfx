import {Person} from './dynamic-form.model';
import {Action} from '@ngrx/store';
import {FormRegistryKey, FormRegistryService, uuid} from 'rfx-lib';
import {MainPersonForm, mainPersonFormDefinition, RegularPersonForm, regularPersonFormDefinition} from './dynamic-form.forms';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

export interface PersonState {
  persons: { [personId: string]: Person };
}

export const defaultFormState: PersonState = {
  persons: {}
};

export function personReducer(state: PersonState = defaultFormState, action: PersonActions): PersonState {
  switch (action.type) {
    case 'UpdateRegularPersonAction': {
      return {
        ...state,
        persons: {
          ...state.persons,
          [action.id]: {
            ...state.persons[action.id],
            type: 'Regular',
            id: action.id,
            firstName: action.firstName,
            lastName: action.lastName,
            formKey: action.formKey
          }
        }
      };
    }
    case 'UpdateMainPersonAction': {
      return {
        ...state,
        persons: {
          ...state.persons,
          [action.id]: {
            ...state.persons[action.id],
            type: 'Main',
            id: action.id,
            firstName: action.firstName,
            lastName: action.lastName,
            emailAddress: action.emailAddress,
            formKey: action.formKey
          }
        }
      };
    }
    case 'DeletePersonAction': {
      const persons = {...state.persons};
      delete persons[action.person.id];
      return {
        ...state,
        persons
      };
    }
    default:
      return state;
  }
}

export class CreateRegularPersonAction implements Action {
  readonly type = 'CreateRegularPersonAction';

  constructor(public readonly firstName: string,
              public readonly lastName: string) {
  }
}

export class CreateMainPersonAction implements Action {
  readonly type = 'CreateMainPersonAction';

  constructor(public readonly firstName: string,
              public readonly lastName: string,
              public readonly emailAddress: string) {
  }
}

export class DeletePersonAction implements Action {
  readonly type = 'DeletePersonAction';

  constructor(public readonly person: Person) {
  }
}

export class UpdateRegularPersonAction implements Action {
  readonly type = 'UpdateRegularPersonAction';

  constructor(public readonly id: string,
              public readonly firstName: string,
              public readonly lastName: string,
              public readonly formKey: FormRegistryKey<RegularPersonForm>) {
  }
}

export class UpdateMainPersonAction implements Action {
  readonly type = 'UpdateMainPersonAction';

  constructor(public readonly id: string,
              public readonly firstName: string,
              public readonly lastName: string,
              public readonly emailAddress: string,
              public readonly formKey: FormRegistryKey<MainPersonForm>) {
  }
}

export type PersonActions = UpdateRegularPersonAction | UpdateMainPersonAction | DeletePersonAction | CreateRegularPersonAction | CreateMainPersonAction;

@Injectable()
export class PersonEffects {
  @Effect() addPersonRegular: Observable<PersonActions> = this.actions
    .pipe(
      filter(action => action instanceof CreateRegularPersonAction),
      map((action: CreateRegularPersonAction) => {
        const {firstName, lastName} = action;
        return <UpdateRegularPersonAction>{
          type: 'UpdateRegularPersonAction',
          id: uuid(),
          firstName,
          lastName,
          formKey: this.formRegistry.createAndRegisterForm(regularPersonFormDefinition, uuid(), {
            firstName,
            lastName
          })
        };
      })
    );

  @Effect() addMainPerson: Observable<PersonActions> = this.actions
    .pipe(
      filter(action => action instanceof CreateMainPersonAction),
      map((action: CreateMainPersonAction) => {
        const {firstName, lastName, emailAddress} = action;
        return <UpdateMainPersonAction>{
          type: 'UpdateMainPersonAction',
          id: uuid(),
          firstName,
          lastName,
          emailAddress,
          formKey: this.formRegistry.createAndRegisterForm(mainPersonFormDefinition, uuid(), {
            firstName,
            lastName,
            emailAddress
          })
        };
      })
    );

  @Effect({dispatch: false}) deletePerson = this.actions
    .pipe(
      filter(action => action instanceof DeletePersonAction),
      tap((action: DeletePersonAction) => this.formRegistry.removeForm(action.person.formKey))
    );

  constructor(private actions: Actions, private formRegistry: FormRegistryService) {
  }
}
