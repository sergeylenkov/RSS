import express, { Request, Response, Router } from 'express';
import * as entries from '../models/entries';
import { log } from '../utils';

import { handle, param } from './utils';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  log('GET entries /');

  handle(res, () => entries.getAll());
});

router.get('/unviewed', (req: Request, res: Response) => {
  log('GET entries /unviewed');

  handle(res, () => entries.unviewed());
});

router.get('/favorites', (req: Request, res: Response) => {
  log('GET entries /favorites');

  handle(res, () => entries.favorites());
});

router.get('/read', (req: Request, res: Response) => {
  log('GET entries /read');

  handle(res, () => entries.read());
});

router.post('/view', (req: Request, res: Response) => {
  const ids: unknown = req.body.ids;

  log('POST entries /view', ids);

  handle(res, () => entries.setViewed(ids));
});

router.put('/:entryId/read', (req: Request, res: Response) => {
  const id = param(req.params.entryId);

  log(`PUT entries /${id}/read`);

  handle(res, () => entries.setRead(id, true));
});

router.delete('/:entryId/read', (req: Request, res: Response) => {
  const id = param(req.params.entryId);

  log(`DELETE entries /${id}/read`);

  handle(res, () => entries.setRead(id, false));
});

router.put('/:entryId/favorite', (req: Request, res: Response) => {
  const id = param(req.params.entryId);

  log(`PUT entries /${id}/favorite`);

  handle(res, () => entries.setFavorite(id, true));
});

router.delete('/:entryId/favorite', (req: Request, res: Response) => {
  const id = param(req.params.entryId);

  log(`DELETE entries /${id}/favorite`);

  handle(res, () => entries.setFavorite(id, false));
});

router.get('/clear/:days', (req: Request, res: Response) => {
  const days = param(req.params.days);

  log(`GET entries /clear/${days}`);

  handle(res, () => entries.clear(days));
});

export default router;
