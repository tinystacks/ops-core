import { Json } from "../types";

abstract class Parseable {
  /**
   * Note: Tried using generics here instead of any but it doesn't work.
   * Typescript expects your generic to extend every possible implementation which is counterproductive. 
  */ 
  static fromYaml (yamlJson: Json): Parseable {
    throw new Error('Method not implemented.');
  }
  static toYaml (object: Parseable): Json {
    throw new Error('Method not implemented.');
  }
  static fromObject (object: Json): Parseable {
    throw new Error('Method not implemented.');
  }
}

export default Parseable;