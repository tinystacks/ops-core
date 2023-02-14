import { Ref, YamlConsoleProperties } from '../types';
import { validatePropertyExists, validateProviderReferences, validateWidgetReferences } from './parser-utils';
import { Parser } from './parser';
import { Console as ConsoleType, Page, Provider, Widget } from '@tinystacks/ops-model';
import { PageParser } from './page-parser';
import { ProviderParser } from './provider-parser';
import { WidgetParser } from './widget-parser';

export class ConsoleParser extends Parser {
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

  static parse (consoleYaml: YamlConsoleProperties): ConsoleType { 
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

    return {
      name,
      providers: providerObjects,
      pages: pageObjects,
      widgets: widgetObjects,
      dependencies
    };
  }
}