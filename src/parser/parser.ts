import { Json } from '../types';

export abstract class Parser {
  static parse (_object: Json): any{ 
    throw new Error('Method not implemented.');
  }
  static fromJson (_object: Json): Parser {
    throw new Error('Method not implemented.');
  }
  abstract toJson (): Json;

  static toYaml (_object: Json): any { 
    throw new Error('Method not implemented.');
  }
}