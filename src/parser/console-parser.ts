import { FlatMap, Ref, YamlConsoleProperties } from '../types';
import { validatePropertyExists, validateProviderReferences, validateWidgetReferences } from './parser-utils';
import { Parser } from './parser';
import { Console as ConsoleType, Page, Provider, Widget } from '@tinystacks/ops-model';
import { PageParser } from './page-parser';
import { ProviderParser } from './provider-parser';
import { WidgetParser } from './widget-parser';

export class ConsoleParser extends Parser implements ConsoleType {
  name: string;
  providers: Record<string, Provider>;
  pages: Record<string, Page>;
  widgets: Record<string, Widget>;
  dependencies: FlatMap;

  constructor (
    name: string,
    providers: Record<string, Provider>,
    pages: Record<string, Page>,
    widgets: Record<string, Widget>, 
    dependencies?: FlatMap
  ) {
    super();
    this.name = name;
    this.providers = providers;
    this.pages = pages;
    this.widgets = widgets;
    this.dependencies = dependencies;
  }
  
  static validate (console: YamlConsoleProperties): void {

    validatePropertyExists(console, 'name', 'Console');
    validatePropertyExists(console, 'providers', 'Console');
    validatePropertyExists(console, 'pages', 'Console');
    validatePropertyExists(console, 'widgets', 'Console');
    validatePropertyExists(console, 'dependencies', 'Console');

    const allWidgetIds: Ref[] = [];
    const allProviders: Ref[] = [];
    Object.keys(console.pages).forEach((id) => { 
      allWidgetIds.push(...console.pages[id].widgets);
    }); 

    Object.keys(console.widgets).forEach((id) => { 
      allProviders.push(console.widgets[id].provider);
      if(console.widgets[id].tabs){ 
        Object.keys(console.widgets[id].tabs).forEach((tabId) => { 
          allWidgetIds.push(...console.widgets[id].tabs[tabId].widgets);
        });
      }
    });
  

    validateWidgetReferences(console.widgets, allWidgetIds);
    validateProviderReferences(console.providers, allProviders);

    //TO-DO -- validations for widget and provider dependencies
    //validateWidgetDependenciesPresent
    //validateProviderDependenciesPresent
 
  }

  static parse (consoleYaml: YamlConsoleProperties): ConsoleParser { 
    const { 
      name,
      providers, 
      pages,
      widgets, 
      dependencies
    } = consoleYaml;

    const pageObjects : Record<string, Page> = {}; 
    Object.keys(pages).forEach((id) => { 
      PageParser.validate(pages[id]);
      pageObjects[id] = PageParser.parse(pages[id]);
    });

    const providerObjects: Record<string, Provider> = {}; 
    Object.keys(providers).forEach((id) => { 
      ProviderParser.validate(providers[id]);
      providerObjects[id] = ProviderParser.parse(providers[id], dependencies[providers[id].type]);
    });

    const widgetObjects: Record<string, Widget> = {}; 
    Object.keys(widgets).forEach((id) => { 
      WidgetParser.validate(widgets[id]);
      widgetObjects[id] = WidgetParser.parse(widgets[id], id,  dependencies[widgets[id].type]);
    });

    return new ConsoleParser(
      name, 
      providerObjects,
      pageObjects,
      widgetObjects, 
      dependencies
    );
  }

  static fromJson (object: ConsoleType): ConsoleParser {
    const {
      name,
      pages: pagesObject = {},
      providers: providersObject = {},
      widgets: widgetsObject = {}, 
      dependencies
    } = object;
    

    // CONFUSION : SHOULD'T ALL THESE CALL *Parser.parse... instead of .fromJson...?
    const pages = Object.entries(pagesObject).reduce<{ [id: string]: Page }>((acc, [id, page]) => {
      acc[id] = PageParser.fromJson(page);
      return acc;
    }, {});
    
    const providers = Object.entries(providersObject).reduce<{ [id: string]: Provider }>((acc, [id, provider]) => {
      acc[id] = ProviderParser.fromJson(provider);
      return acc;
    }, {});
    
    const widgets = Object.entries(widgetsObject).reduce<{ [id: string]: Widget }>((acc, [id, widgetObject]) => {
      acc[id] = WidgetParser.fromJson(widgetObject);
      return acc;
    }, {});

    return new ConsoleParser(
      name,
      providers,
      pages,
      widgets, 
      dependencies
    );
  }

  toJson (): ConsoleType { 
    return { 
      name: this.name,
      providers: this.providers,
      pages: this.pages,
      widgets: this.widgets
    };
  }

}