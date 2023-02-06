import { Request, Response, NextFunction } from 'express';
import PageController from '../../../controllers/page-controller';

export default function () {
  return {
    async GET (request: Request, response: Response, next: NextFunction) {
      try {
        const pages = await PageController.getPages(request.params.consoleName);
        response.status(200).send(pages);
      } catch (error) {
        next(error);
      }
    },
    
    async POST (request: Request, response: Response, next: NextFunction) {
      try {
        const page = await PageController.postPage(request.params.consoleName, request.body);
        response.status(200).send(page);
      } catch (error) {
        next(error);
      }
    }
  };
}