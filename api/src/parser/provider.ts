import { YamlProvider } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { Parser } from "./parser";
import { AwsAssumedRole, AwsKeys, LocalAwsProfile, Provider as ProviderType } from '@tinystacks/ops-model';

export class Provider extends Parser implements ProviderType {

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
  
  static validate(yamlProvider: YamlProvider): void {
    validatePropertyExists(yamlProvider, 'type', "Provider"); 
  }

  static parse(yamlProvider: YamlProvider): Provider{ 
    const { 
      id, 
      type
    } = yamlProvider;

    //need to figure out credentials
    return new Provider(
      id, 
      type
    ); 
  }

  static fromJson (object: ProviderType): Provider {
    const { 
      id, 
      type, 
      //credentials
    } = object;

    return new Provider(
      id, 
      type
    ); 
  }
  
  toJson(): ProviderType { 

    return { 
      id: this.id, 
      type: this.type
    }
    
  }

}