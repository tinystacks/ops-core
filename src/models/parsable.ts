import { StatusCodes } from 'http-status-codes';
import TinyStacksError from '../tinystacks-error';
import { Json, Typed } from '../types';

export abstract class Parsable implements Typed {
  static fromJson (_object: Json, ..._args: any[]): Promise<Parsable> | Parsable {
    throw TinyStacksError.fromJson({
      status: StatusCodes.NOT_IMPLEMENTED,
      message: 'The parseable you called this method on did not implement "fromJson".'
    });
  }
  abstract toJson (): Promise<Json> | Json;
}