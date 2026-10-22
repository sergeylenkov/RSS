import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import feeds from './routes/feeds';
import entries from './routes/entries';
import settings from './settings';
import { log } from './utils';

export function createApp(): Express {
  const app = express();

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  app.use(bodyParser.json());

  app.use('/feeds', feeds);
  app.use('/entries', entries);

  return app;
}

const app = createApp();

// Only a direct `tsx index.ts` run opens a port. When the module is imported
// (tests, supertest) the app is handed over as is, so nothing is listening.
if (require.main === module) {
  app.listen(settings.port);

  log('App is listening on port ' + settings.port);
  log(`App settings: port=${settings.port}, db=${settings.db}, debug=${settings.debug} `);
}

export default app;
