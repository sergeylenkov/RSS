/**
 * Base URL of the API.
 *
 * It is provided by the build (`DefinePlugin` in the webpack config, which
 * reads `API_URL` from the environment) so the same sources work locally,
 * in Docker and behind any reverse proxy. The literal fallback keeps the
 * sources usable on their own.
 */
const apiUrl =
  typeof __API_URL__ !== 'undefined' ? __API_URL__ : 'http://localhost:9000/';

const prod = {
  urls: {
    api: apiUrl,
  },
};

const dev = {
  urls: {
    api: apiUrl,
  },
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;

