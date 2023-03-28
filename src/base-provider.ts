import { validatePropertyExists } from './parser-utils.js';
import { Provider } from '@tinystacks/ops-model';
import { createRequire } from 'node:module';
import { DEPENDENCIES_DIRECTORY } from './env-vars.js';

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
      // let dependencySourcePath = dependencySource;
      // if (DEPENDENCIES_DIRECTORY) {
      //   const require = createRequire(DEPENDENCIES_DIRECTORY);
      //   dependencySourcePath = require.resolve(dependencySource);
      // }
      const dependencySourcePath = await import.meta.resolve(`${DEPENDENCIES_DIRECTORY}${dependencySource}`);
      const providerType = (await import(dependencySourcePath))[object.type];
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