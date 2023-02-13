import { Request, Response, NextFunction } from 'express';
import WidgetController from '../../../controllers/widget-controller';

export default function () {
  return {    
    async POST (request: Request, response: Response, next: NextFunction) {
      try {
        const widget = await WidgetController.postWidget(request.params.consoleName, request.body);
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    }
  };
}