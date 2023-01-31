import { Request, Response, NextFunction } from 'express';
import PageController from '../../../../controllers/page-controller';

export default function () {
  return {
    async PUT (request: Request, response: Response, next: NextFunction) {
      try {
        const console = await PageController.putPage(request.params.consoleName, request.params.pageRoute, request.body);
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    },

    async DELETE (request: Request, response: Response, next: NextFunction) {
      try {
        const console = await PageController.deletePage(request.params.consoleName, request.params.pageRoute);
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    }
  };
}