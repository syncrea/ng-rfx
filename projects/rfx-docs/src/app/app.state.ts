import {PersonEffects, personReducer, PersonState} from './dynamic-form/dynamic-form.state';

export interface GlobalState {
  personState: PersonState;
}

export const globalReducers = {
  personState: personReducer
};

export const globalEffects = [
  PersonEffects
];
