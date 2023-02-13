import { Request, Response, NextFunction } from 'express';
import ConsoleController from '../controllers/console-controller';

export default function () {
  return {
    async GET (_request: Request, response: Response, next: NextFunction) {
      try {
        const console = await ConsoleController.getConsoles();
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    },
    
    async POST (request: Request, response: Response, next: NextFunction) {
      try {
        const console = await ConsoleController.postConsole(request.body);
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    },
    
    async PUT (request: Request, response: Response, next: NextFunction) {
      try {
        const console = await ConsoleController.putConsole(request.params.consoleName, request.body);
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    },

    async DELETE (request: Request, response: Response, next: NextFunction) {
      try {
        const console = await ConsoleController.deleteConsole(request.params.consoleName);
        response.status(200).send(console);
      } catch (error) {
        next(error);
      }
    }
  };
}