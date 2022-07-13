export interface AppState {
  version: string;
}

export function appReducer(state: AppState = {version: '13.0.2'}) {
  return state;
}

export interface GlobalState {
  app: AppState;
}

export const globalReducers = {
  app: appReducer
};
