import { YamlProvider } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Parser } from './parser';
import { AwsAssumedRole, AwsKeys, LocalAwsProfile, Provider as ProviderType } from '@tinystacks/ops-model';

export class ProviderParser extends Parser implements ProviderType {

  id?: string;
  type: string;
  credentials?: (AwsKeys | AwsAssumedRole | LocalAwsProfile);

  constructor (
    type: string,
    id?: string, 
    credentials?: (AwsKeys | AwsAssumedRole | LocalAwsProfile)
  ) {
    super();
    this.id = id;
    this.type = type;
    this.credentials = credentials;

  }

  static parse (yamlProvider: YamlProvider, id?: string): ProviderParser { 
    const { 
      type
    } = yamlProvider;

    //need to figure out credentials
    return new ProviderParser(
      type,
      id
    ); 
  }

  static fromJson (object: ProviderType, dependencySource?: string): ProviderParser {
    
    validatePropertyExists(object, 'type', 'Provider'); 
    try { 
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const providerType = require(dependencySource)[object.type];
      const provider = providerType.fromJson(object);
      return provider; 
    } catch(e){ 
      throw Error(`Error trying to load module ${dependencySource} for type ${object.type}`);
    }
  }
  
  toJson (): ProviderType { 
    return { 
      id: this.id, 
      type: this.type
    };
  }

}