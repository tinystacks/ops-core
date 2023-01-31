import { Request, Response, NextFunction } from 'express';
import WidgetController from '../../../../controllers/widget-controller';

export default function () {
  return {
    async GET (request: Request, response: Response, next: NextFunction) {
      try {
        const widget = await WidgetController.getWidget(request.params.consoleName, request.params.widgetId);
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    },

    async PUT (request: Request, response: Response, next: NextFunction) {
      try {
        const widget = await WidgetController.putWidget(request.params.consoleName, request.params.widgetId, request.body);
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    },

    async DELETE (request: Request, response: Response, next: NextFunction) {
      try {
        const widget = await WidgetController.deleteWidget(request.params.consoleName, request.params.widgetId);
        response.status(200).send(widget);
      } catch (error) {
        next(error);
      }
    }
  };
}