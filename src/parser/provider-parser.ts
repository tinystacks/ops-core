import { YamlProvider } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Parser } from './parser';
import { Provider as ProviderType } from '@tinystacks/ops-model';

export class ProviderParser extends Parser {
  static validate (yamlProvider: YamlProvider): void {
    validatePropertyExists(yamlProvider, 'type', 'Provider'); 
  }

  static parse (yamlProvider: YamlProvider, dependencySource?: string): ProviderType { 
    try { 
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const providerType = require(dependencySource)[yamlProvider.type];
      const provider = providerType.fromJson(yamlProvider);
      return provider; 
    } catch(e){ 
      throw Error(`Error trying to load module ${dependencySource} for type ${yamlProvider.type}`);
    }
  }
}