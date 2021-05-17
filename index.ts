import express, { NextFunction, Response } from 'express';
const app = express();

import { Logger } from './logging/Logger';
import { Stats } from './statistics/Stats';

const logger = new Logger();
const stats = new Stats(logger);

app.use(express.json());
app.use((req, res, next) => {
  stats.newRequest(req, res, next);
});
app.use((req: Express.Request, res: Express.Response, next: NextFunction) =>
  logger.request(req, res, next)
);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    msg: 'Welcome!',
  });
});

app.get('/users', (req, res) => {
  res.status(200).json(stats.getUsers());
});

app.post('/users/resetStatistics/jsons', (req, res) => {
  stats.removeJSONs();

  res.status(200).json({ success: true });
});

app.post('/users/resetStatistics/sure/:pwd', (req, res) => {
  if (req.params.pwd === Stats.pwd) {
    stats.resetStats();
    return res
      .status(200)
      .json({ success: true, msg: 'All the data was deleted!' });
  }
  res.status(403).json({ success: false });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.listen(PORT));
