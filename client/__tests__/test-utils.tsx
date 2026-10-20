import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, Store } from 'redux';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import rootReducer, { State } from '../src/store/reducers';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  useRouter?: boolean;
  preloadedState?: Partial<State>;
  store?: Store<State>;
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
): RenderResult & { store: Store<State> } {
  // Each render gets its own store instance so tests stay isolated from
  // one another (the app itself uses a module-level singleton store).
  const testStore =
    store ||
    createStore(
      rootReducer as unknown as (state: State | undefined, action: unknown) => State,
      preloadedState as State | undefined
    );

  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
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