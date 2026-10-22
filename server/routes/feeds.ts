import express, { Request, Response, Router } from 'express';
import * as feeds from '../models/feeds';
import { log } from '../utils';
import { handle, param } from './utils';
import { FeedPatch } from '../types/models';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
  log('GET feeds /');

  handle(res, () => feeds.getAll());
});

router.get('/update', (req: Request, res: Response) => {
  log('GET feeds /update');

  handle(res, () => feeds.update());
});

router.post('/', (req: Request, res: Response) => {
  const link: string = req.body.link;

  log('POST feeds /', link);

  handle(res, () => feeds.add(link));
});

router.patch('/:feedId', (req: Request, res: Response) => {
  const id = param(req.params.feedId);
  const data: FeedPatch = req.body;

  log(`PATCH feeds /${id}`, data);

  handle(res, () => feeds.patch(id, data));
});

router.delete('/:feedId', (req: Request, res: Response) => {
  const id = param(req.params.feedId);

  log(`DELETE feeds /${id}`);

  handle(res, () => feeds.remove(id));
});

export default router;
