import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import { initialize } from 'express-openapi';
import yaml from 'yamljs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { resolveRefsAt } from 'json-refs';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './middleware';

async function startServer () {
  if (process.env.NODE_ENV === 'dev') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
    const CONFIG_PATH = process.env.CONFIG_PATH;
  
    if (!CONFIG_PATH) {
      console.warn('No config path specified! API results may be empty.');
    }
  }
  
  // Constants
  const PORT = process.env.PORT || 8000;
  
  // App handlers
  const app: Application = express();
  app.use(json());
  
  const rootDocLocation = require.resolve('@tinystacks/ops-model/src/index.yml');
  const apiDoc = yaml.parse(readFileSync(rootDocLocation, 'utf-8'));

  const swaggerSpec = await resolveRefsAt(rootDocLocation,  {
    loaderOptions : {
      processContent: (res: any, callback: any) => {
        callback(null, yaml.parse(res.text));
      }
    }
  });
  
  await initialize({
    app,
    apiDoc,
    paths: resolve(__dirname, './routes'),
    promiseMode: true,
    errorMiddleware
  });
  
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec.resolved)
  );
  
  app.get('/', (_request: Request, response: Response) => {
    const responseBody = 'Hello world from ops-console-api!';
    response.status(200).send(responseBody);
  });
  
  // app.get('/*', (_request: Request, response: Response) => {
  //   response.status(204).send();
  // });
  
  app.use(errorMiddleware);
  
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
}
void startServer();