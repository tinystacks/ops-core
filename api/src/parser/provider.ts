import { YamlProvider } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { ParsingService } from "./parsing-service";
import { AwsAssumedRole, AwsKeys, LocalAwsProfile, Provider as ProviderType } from '@tinystacks/ops-model';

export class Provider extends ParsingService implements ProviderType {

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
  
  validate(yamlProvider: YamlProvider): void {
    validatePropertyExists(yamlProvider, 'type', "Provider"); 
  }

  parse(yamlProvider: YamlProvider): Provider{ 
    const { 
      id, 
      type, 
      credentials
    } = yamlProvider;
    
    return new Provider(
      id, 
      type, 
      credentials
    ); 
  }

}