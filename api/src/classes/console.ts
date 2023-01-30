import Page from './page';
import Provider from './provider';
import Parseable from './parseable';
import { Console as ConsoleType, Provider as ProviderType } from '@tinystacks/ops-model';
import { Json, YamlConsole, YamlProvider } from '../types';

class Console extends Parseable implements ConsoleType {
  name: string;
  pages: Page[];
  providers: Provider[];

  constructor (
    name: string,
    pages: Page[] = [],
    providers: Provider[] = []
  ) {
    super();
    this.name = name;
    this.pages = pages;
    this.providers = providers;
  }

  static fromYaml (yamlJson: YamlConsole): Console {
    const {
      name,
      pages: pageObjects = [],
      providers: providerObjects = []
    } = yamlJson.Console;
    const pages = pageObjects.map(Page.fromYaml);
    const providers = providerObjects.map((providerObject: YamlProvider) => {
      const [type, properties]: [string, ProviderType] = Object.entries(providerObject)?.at(0);
      return {
        ...properties,
        type
      };
    });
    return new Console(
      name,
      pages,
      providers
    );
  }
  
  static toYaml (console: ConsoleType): YamlConsole {
    const {
      name,
      pages: pageObjects = [],
      providers: providerObjects = []
    } = console;
    const pages = pageObjects.map(Page.toYaml);
    const providers = providerObjects.map((providerObject: ProviderType & Json) => {
      const { type } = providerObject;
      return {
        [type]: providerObject
      };
    });
    return {
      Console: {
        name,
        pages,
        providers
      }
    };
  }

  static fromObject (object: ConsoleType): Console {
    const {
      name,
      pages: pageObjects = [],
      providers
    } = object;
    const pages = pageObjects.map(Page.fromObject);
    return new Console(
      name,
      pages,
      providers
    );
  }

}

export default Console;