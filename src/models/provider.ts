import { dynamicRequire, validatePropertyExists } from '../parser-utils.js';
import { Provider as ProviderType } from '@tinystacks/ops-model';
import { Parsable } from './parsable.js';

export abstract class Provider extends Parsable implements ProviderType {
  id: string;
  type: string;

  constructor (props: ProviderType) {
    super();
    this.id = props.id;
    this.type = props.type;
  }

  static fromJson (object: ProviderType, dependencySource?: string): Promise<Provider> | Provider {
    validatePropertyExists(object, 'type', 'Provider');
    return dynamicRequire<ProviderType, Provider>(object, dependencySource);
  }

  toJson (): ProviderType {
    return {
      id: this.id,
      type: this.type
    };
  }
}