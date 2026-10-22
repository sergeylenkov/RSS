import { Response } from 'express';

/**
 * Every route answers with `200` on success and `500` with `{ error }` on
 * failure, which is the contract the client already relies on.
 */
export function sendError(res: Response, error: unknown): void {
  res.status(500).send({ error });
}

/**
 * Wraps an async handler so a rejected promise becomes a `500` response
 * instead of an unhandled rejection.
 */
export function handle<T>(
  res: Response,
  work: () => Promise<T>
): void {
  work()
    .then((result) => {
      res.json(result);
    })
    .catch((error: unknown) => {
      sendError(res, error);
    });
}

/**
 * Express 5 types route parameters as `string | string[]`. None of the routes
 * use repeated parameters, so the value is narrowed here instead of at every
 * call site.
 */
export function param(value: string | string[]): string {
  return Array.isArray(value) ? (value[0] ?? '') : value;
}
