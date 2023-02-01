import { Request, Response, NextFunction } from 'express';
import PingController from '../controllers/ping-controller';
import ConsoleController from '../controllers/console-controller';

export default function () {
  return {
    async GET (_request: Request, response: Response, next: NextFunction) {
      try {
        const ping = await PingController.getPing();
        response.status(200).send(ping);
      } catch (error) {
        next(error);
      }
    }
  };
}