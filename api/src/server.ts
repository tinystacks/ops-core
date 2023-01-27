import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';

if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}

// Constants
const PORT = process.env.PORT || 8000;

// App handlers
const app: Application = express();
app.use(json());

app.get('/', (_request: Request, response: Response) => {
  const responseBody = 'Hello world from ops-console-api!';
  response.status(200).send(responseBody);
});

app.get('/ping', (_request: Request, response: Response) => {
  response.status(200).send('GET - pong');
});

app.post('/ping', (request: Request, response: Response) => {
  console.info('request.body', JSON.stringify(request.body, null, 2));
  response.status(200).send('POST - pong');
});

app.get('/*', (_request: Request, response: Response) => {
  const responseBody = 'Hello world from ops-console-api\'s catch all block!';
  response.status(200).send(responseBody);
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});