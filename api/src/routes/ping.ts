import { Request, Response, NextFunction } from 'express';
import PingController from '../controllers/ping-controller';

export default function () {
  const operations = {
    GET
  };

  async function GET (_request: Request, response: Response, next: NextFunction) {
    try {
      const ping = await PingController.getPing();
      response.status(200).send(ping);
    } catch (error) {
      next(error);
    }
  }

  return operations;
}