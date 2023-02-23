import { validatePropertyExists } from './parser-utils';
import { Provider } from '@tinystacks/ops-model';

export abstract class BaseProvider implements Provider {
  id: string;
  type: string;

  constructor (
    type: string,
    id: string
  ) {
    this.id = id;
    this.type = type;
  }

  static async fromJson<T extends BaseProvider> (object: Provider, dependencySource?: string): Promise<T> {
    validatePropertyExists(object, 'type', 'Provider'); 
    try { 
      const providerType = (await import(dependencySource))[object.type];
      const provider = await providerType.fromJson(object);
      return provider; 
    } catch(e){ 
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