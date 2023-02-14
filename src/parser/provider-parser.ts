import { YamlProvider } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Parser } from './parser';
import { AwsAssumedRole, AwsKeys, LocalAwsProfile, Provider as ProviderType } from '@tinystacks/ops-model';

export class ProviderParser extends Parser implements ProviderType {

  id: string;
  type: string;
  credentials?: (AwsKeys | AwsAssumedRole | LocalAwsProfile);

  constructor (
    id: string, 
    type: string,
    credentials?: (AwsKeys | AwsAssumedRole | LocalAwsProfile)
  ) {
    super();
    this.id = id;
    this.type = type;
    this.credentials = credentials;

  }
  
  static validate (yamlProvider: YamlProvider): void {
    validatePropertyExists(yamlProvider, 'type', 'Provider'); 
  }

  static parse (yamlProvider: YamlProvider, dependencySource?: string): ProviderType { 
    try { 
      const providerType = require(dependencySource)[yamlProvider.type];
      const provider = providerType.fromJson(yamlProvider);
      return provider; 
    } catch(e){ 
      throw Error(`Error trying to load module ${dependencySource} for type ${yamlProvider.type}`);
    }
  }

  static fromJson (object: ProviderType): ProviderParser {
    const { 
      id, 
      type
    } = object;

    return new ProviderParser(
      id, 
      type
    ); 
  }
  
  toJson (): ProviderType { 
    return { 
      id: this.id, 
      type: this.type
    };
  }

}