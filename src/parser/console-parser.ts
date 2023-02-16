import { FlatMap, YamlConsoleProperties, YamlPage, YamlProvider, YamlWidget } from '../types';
import { validateConsole } from './parser-utils';
import { Parser } from './parser';
import { Console as ConsoleType, Page, Provider, Widget } from '@tinystacks/ops-model';
import { PageParser } from './page-parser';
import { ProviderParser } from './provider-parser';
import { WidgetParser } from './widget-parser';

export class ConsoleParser extends Parser implements ConsoleType {
  name: string;
  providers: Record<string, ProviderParser>;
  pages: Record<string, PageParser>;
  widgets: Record<string, WidgetParser>;
  dependencies?: FlatMap;

  constructor (
    name: string,
    providers: Record<string, ProviderParser>,
    pages: Record<string, PageParser>,
    widgets: Record<string, WidgetParser>, 
    dependencies?: FlatMap
  ) {
    super();
    this.name = name;
    this.providers = providers;
    this.pages = pages;
    this.widgets = widgets;
    this.dependencies = dependencies;
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
      pageObjects[id] = PageParser.parse(pages[id]);
    });

    const providerObjects: Record<string, Provider> = {}; 
    Object.keys(providers).forEach((id) => { 
      providerObjects[id] = ProviderParser.parse(providers[id]);
    });

    const widgetObjects: Record<string, Widget> = {}; 
    Object.keys(widgets).forEach((id) => {
      widgetObjects[id] = WidgetParser.parse(widgets[id], id);
    });

    return {
      name, 
      providers: providerObjects,
      pages: pageObjects,
      widgets: widgetObjects, 
      dependencies
    };
  }

  static fromJson (object: ConsoleType): ConsoleParser {
    const {
      name,
      pages: pagesObject = {},
      providers: providersObject = {},
      widgets: widgetsObject = {}, 
      dependencies
    } = object;
    
    validateConsole(object);

    const pages = Object.entries(pagesObject).reduce<{ [id: string]: PageParser }>((acc, [id, page]) => {
      acc[id] = PageParser.fromJson(page);
      return acc;
    }, {});
    
    const providers = Object.entries(providersObject).reduce<{ [id: string]: ProviderParser }>((acc, [id, provider]) => {
      acc[id] = ProviderParser.fromJson(provider, dependencies[providers[id].type]);
      return acc;
    }, {});
    
    const widgets = Object.entries(widgetsObject).reduce<{ [id: string]: WidgetParser }>((acc, [id, widgetObject]) => {
      acc[id] = WidgetParser.fromJson(widgetObject, dependencies[widgets[id].type]);
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

  deepParse (consoleYaml: YamlConsoleProperties): ConsoleParser {
    const parsedYaml: ConsoleType = ConsoleParser.parse(consoleYaml);
    return ConsoleParser.fromJson(parsedYaml);
  }

  addPage (page: Page, id: string): void {
    this.pages = this.pages || {};
    this.pages[page.id || id] = PageParser.fromJson(page);
  }

  updatePage (page: Page, id:string): void {
    this.pages = this.pages || {};
    this.pages[page.id || id] = PageParser.fromJson(page);
  }
  
  deletePage (id: string): void {
    this.pages = this.pages || {};
    delete this.pages[id];
  }
  
  addWidget (widget: Widget, id: string): void {
    this.widgets = this.widgets || {};
    this.widgets[widget.id || id] = WidgetParser.fromJson(widget);
  }

  updateWidget (widget: Widget, id: string): void {
    this.widgets = this.widgets || {};
    this.widgets[widget.id || id] = WidgetParser.fromJson(widget);;
  }
  
  deleteWidget (id: string): void {
    this.widgets = this.widgets || {};
    delete this.widgets[id];
  }

  static toYaml (Console: ConsoleType): YamlConsoleProperties {
    const { 
      name,
      pages,
      providers, 
      widgets, 
      dependencies
    } = Console;

    const pageObjects = Object.entries(pages).reduce<{ [id: string]: YamlPage }>((acc, [id, page]) => {
      acc[id] = PageParser.toYaml(page);
      return acc;
    }, {});
    
    const providerObjects = Object.entries(providers).reduce<{ [id: string]: YamlProvider }>((acc, [id, provider]) => {
      acc[id] = provider;
      return acc;
    }, {});
    
    const widgetObjects = Object.entries(widgets).reduce<{ [id: string]: YamlWidget }>((acc, [id, widget]) => {
      // TODO: Replace this with the plugin classes
      const widgetJson = WidgetParser.fromJson(widget); 
      acc[id] = WidgetParser.toYaml(widgetJson);
      return acc;
    }, {});
    return {
      name,
      pages: pageObjects,
      providers: providerObjects,
      widgets: widgetObjects,
      dependencies: dependencies
    };
  }

}