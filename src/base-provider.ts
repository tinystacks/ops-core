import { dynamicRequire, validatePropertyExists } from './parser-utils.js';
import { Provider } from '@tinystacks/ops-model';

export abstract class BaseProvider implements Provider {
  id: string;
  type: string;

  constructor (props: Provider) {
    this.id = props.id;
    this.type = props.type;
  }

  static fromJson (object: Provider, dependencySource?: string): Promise<BaseProvider> | BaseProvider {
    validatePropertyExists(object, 'type', 'Provider');
    return dynamicRequire<Provider>(object, dependencySource);
  }

  toJson (): Provider {
    return {
      id: this.id,
      type: this.type
    };
  }
}