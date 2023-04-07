import { validatePropertyExists } from './parser-utils.js';
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
    return this.dynamicRequire(object, dependencySource);
  }

  private static async dynamicRequire (object: Provider, dependencySource?:string): Promise<BaseProvider> {
    try {
      const providerType = (await import(dependencySource))[object.type];
      const provider = await providerType.fromJson(object);
      return provider;
    } catch(e){
      console.error(e);
      throw Error(`Error trying to load module ${dependencySource} for type ${object.type}`);
    }
  }

  toJson (): Provider {
    return {
      id: this.id,
      type: this.type
    };
  }
}