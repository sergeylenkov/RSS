import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver, which is used by EntriesList.
class MockIntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
}

(global as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  MockIntersectionObserver;
(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  MockIntersectionObserver;
