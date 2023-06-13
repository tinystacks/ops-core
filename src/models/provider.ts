import { dynamicRequire, validatePropertyExists } from '../parser-utils.js';
import { Provider as ProviderType } from '@tinystacks/ops-model';

export abstract class Provider implements ProviderType {
  id: string;
  type: string;

  constructor (props: ProviderType) {
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