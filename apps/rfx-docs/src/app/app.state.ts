export interface AppState {
  version: string;
}

export function appReducer(state: AppState = {version: '3.0.0'}) {
  return state;
}

export interface GlobalState {
  app: AppState;
}

export const globalReducers = {
  app: appReducer
};
