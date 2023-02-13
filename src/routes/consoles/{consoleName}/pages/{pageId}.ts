import { Request, Response, NextFunction } from 'express';
import PageController from '../../../../controllers/page-controller';

export default function () {
  return {
    async PUT (request: Request, response: Response, next: NextFunction) {
      try {
        const page = await PageController.putPage(request.params.consoleName, request.params.pageId, request.body);
        response.status(200).send(page);
      } catch (error) {
        next(error);
      }
    },

    async DELETE (request: Request, response: Response, next: NextFunction) {
      try {
        const page = await PageController.deletePage(request.params.consoleName, request.params.pageId);
        response.status(200).send(page);
      } catch (error) {
        next(error);
      }
    }
  };
}