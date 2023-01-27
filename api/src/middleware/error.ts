import { Request, Response, NextFunction } from 'express';
import { TinyStacksError } from '@tinystacks/ops-model';

export async function errorMiddleware (error: TinyStacksError, request: Request, response: Response, next: NextFunction) {
  console.error(error);
  // Not sure if this check is valid
  // Probably need to implement TinyStacksError and use instanceOf
  if (typeof error === typeof TinyStacksError) {
    const { status, message } = error;
    response.status(status || 500).json({ status, message });
  } else {
    response.status(500).json({ status: 500, message: 'An unexpected error occured!' });
  }
  next();
}