export interface AppState {
  version: string;
}

export function appReducer(state: AppState = {version: '1.0.0-rc14'}) {
  return state;
}

export interface GlobalState {
  app: AppState;
}

export const globalReducers = {
  app: appReducer
};
