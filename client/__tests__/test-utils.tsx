import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import rootReducer, { initialState, State } from '../src/store/reducers';

// The store's action type is the app's closed `Actions` union, so a bare
// `Store<State>` (which defaults to `UnknownAction`) cannot describe it.
// Deriving the type from a real `configureStore` call keeps both in sync.
const createTestStore = (preloadedState?: Partial<State>) =>
  configureStore({ reducer: rootReducer, preloadedState });

type TestStore = ReturnType<typeof createTestStore>;

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  useRouter?: boolean;
  preloadedState?: Partial<State>;
  store?: TestStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    useRouter = false,
    preloadedState,
    store,
    ...options
  }: Options = {}
): RenderResult & { store: TestStore } {
  // Each render gets its own store instance so tests stay isolated from
  // one another (the app itself uses a module-level singleton store).
  // `configureStore` passes `preloadedState` to a single-function reducer
  // verbatim (it only fills in missing keys when the reducer is built with
  // `combineReducers`), so it must be merged here: `preloadedState` is a set
  // of overrides and every other field has to stay defined.
  const testStore =
    store ||
    createTestStore({
      ...initialState,
      ...preloadedState,
    } as State);

  function Wrapper({ children }: { children: ReactNode }): React.JSX.Element {
    const content = useRouter ? (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ) : (
      children
    );

    return <Provider store={testStore}>{content}</Provider>;
  }

  const result = render(ui, { wrapper: Wrapper, ...options });

  return { store: testStore, ...result };
}

export * from '@testing-library/react';
