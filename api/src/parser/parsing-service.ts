import { Json } from "../types";

export abstract class ParsingService {
  static parse(_object: Json): any{ 
    throw new Error('Method not implemented.');
  }
  static validate(_object: Json): void { 
    throw new Error('Method not implemented.');
  }
}