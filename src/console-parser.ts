import { validateConsole } from './parser-utils.js';
import {
  Console, Page, Provider, Widget, YamlConsole, YamlWidget, YamlProvider
} from '@tinystacks/ops-model';
import { PageParser } from './page-parser.js';
import { BaseProvider } from './base-provider.js';
import { BaseWidget } from './base-widget.js';

type ExportRefs = { [ref: string]: string }[];
type ExportYamlWidget = Omit<YamlWidget, 'providers' | 'children'> & {
  providers: ExportRefs,
  children: ExportRefs
}

type ExportConsoleYaml = Omit<YamlConsole, 'widgets'> & {
  widgets: { [id: string]: ExportYamlWidget }
}

export class ConsoleParser implements Console {
  name: string;
  providers: Record<string, BaseProvider>;
  pages: Record<string, PageParser>;
  widgets: Record<string, BaseWidget>;
  dependencies?: Record<string, string>;

  constructor (
    name: string,
    providers: Record<string, BaseProvider>,
    pages: Record<string, PageParser>,
    widgets: Record<string, BaseWidget>, 
    dependencies?: Console['dependencies']
  ) {
    this.name = name;
    this.providers = providers;
    this.pages = pages;
    this.widgets = widgets;
    this.dependencies = dependencies;
  }

  static parse (consoleYaml: YamlConsole): Console { 
    const { 
      name,
      providers, 
      pages,
      widgets, 
      dependencies
    } = consoleYaml;

    const pageObjects : Record<string, Page> = {}; 
    Object.keys(pages).forEach((id) => { 
      pageObjects[id] = PageParser.parse(pages[id], id);
    });

    const providerObjects: Record<string, Provider> = {}; 
    Object.keys(providers).forEach((id) => { 
      providerObjects[id] = this.parseProvider(providers[id], id);
    });

    const widgetObjects: Record<string, Widget> = {}; 
    Object.keys(widgets).forEach((id) => {
      widgetObjects[id] = this.parseWidget(widgets[id], id);
    });

    return {
      name, 
      providers: providerObjects,
      pages: pageObjects,
      widgets: widgetObjects, 
      dependencies
    };
  }

  static async fromJson (object: Console): Promise<ConsoleParser> {
    const {
      name,
      pages,
      providers,
      widgets, 
      dependencies
    } = object;
    
    validateConsole(object);

    const pageObjects = Object.entries(pages).reduce<{ [id: string]: PageParser }>((acc, [id, page]) => {
      acc[id] = PageParser.fromJson(page);
      return acc;
    }, {});
    
    const resolvedProviders: { [id: string]: BaseProvider } = {}; 
    for (const [id, provider] of Object.entries(providers)) {
      resolvedProviders[id] = await BaseProvider.fromJson(provider, dependencies[providers[id].type]);
    }
    
    const resolvedWidgets: { [id: string]: BaseWidget } = {};
    for (const [id, widget] of Object.entries(widgets)) {
      resolvedWidgets[id] = await BaseWidget.fromJson(widget, dependencies[widgets[id].type]);
    }

    return new ConsoleParser(
      name,
      resolvedProviders,
      pageObjects,
      resolvedWidgets, 
      dependencies
    );
  }

  toJson (): Console { 
    const pages = Object.entries(this.pages).reduce<{ [id: string]: Page }>((acc, [id, page]) => {
      acc[id] = page.toJson();
      return acc;
    }, {});
    
    const providers = Object.entries(this.providers).reduce<{ [id: string]: Provider }>((acc, [id, provider]) => {
      acc[id] = provider.toJson();
      return acc;
    }, {});
    
    const widgets = Object.entries(this.widgets).reduce<{ [id: string]: Widget }>((acc, [id, widget]) => {
      acc[id] = widget.toJson();
      return acc;
    }, {});
    return {
      name: this.name,
      pages,
      providers,
      widgets,
      dependencies: this.dependencies
    };
  }

  async deepParse (consoleYaml: YamlConsole): Promise<ConsoleParser> {
    const parsedYaml: Console = ConsoleParser.parse(consoleYaml);
    return await ConsoleParser.fromJson(parsedYaml);
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
  
  async addWidget (widget: Widget, id: string) {
    this.widgets = this.widgets || {};
    this.widgets[widget.id || id] = await BaseWidget.fromJson(widget);
  }
 
  async updateWidget (widget: Widget, id: string) {
    this.widgets = this.widgets || {};
    this.widgets[widget.id || id] = await BaseWidget.fromJson(widget);
  }
  
  deleteWidget (id: string): void {
    this.widgets = this.widgets || {};
    delete this.widgets[id];
  }

  static async toYaml (console: Console): Promise<ExportConsoleYaml> {
    const { 
      name,
      pages,
      providers, 
      widgets, 
      dependencies
    } = console;

    const pageObjects: { [id: string]: Page } = {};
    for (const [id, page] of Object.entries(pages)) {
      pageObjects[id] = PageParser.toYaml(page);
    }
    
    const providerObjects: { [id: string]: YamlProvider } = {};
    for (const [id, provider] of Object.entries(providers)) {
      providerObjects[id] = provider;
    }
    
    const widgetObjects: { [id: string]: ExportYamlWidget } = {}; 
    for (const [id, widget] of Object.entries(widgets)) {
      widgetObjects[id] = this.widgetToYaml(widget);
    }

    return {
      name,
      pages: pageObjects,
      providers: providerObjects,
      widgets: widgetObjects,
      dependencies: dependencies
    };
  }

  static parseProvider (yamlProvider: any, id: string): Provider { 
    //need to figure out credentials
    return {
      ...yamlProvider,
      id
    };
  }

  static parseWidget (yamlWidget: YamlWidget, id: string): Widget & Record<string, any> {
    // TALK ABOUT THIS WHAT'S GOING ON HERE??
    const providers = (yamlWidget.providers || []).map((provider: any) => provider.$ref.split('/')[3]);
    return { ...yamlWidget, providers, id };
  }

  static widgetToYaml (widget: Widget & Record<string, any>): ExportYamlWidget {
    return {
      id: widget.id,
      displayName: widget.displayName,
      description: widget.description,
      type: widget.type,
      displayOptions: widget.displayOptions,
      providers: widget.providerIds.map(providerId => ({ $ref: `#/Console/providers/${providerId}` })),
      children: widget.childrenIds.map(childId => ({ $ref: `#/Console/widgets/${childId}` }))
    };
  }

}