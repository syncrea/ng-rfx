export interface AppState {
  version: string;
}

export function appReducer(state: AppState = {version: '2.0.0-rc1'}) {
  return state;
}

export interface GlobalState {
  app: AppState;
}

export const globalReducers = {
  app: appReducer
};
