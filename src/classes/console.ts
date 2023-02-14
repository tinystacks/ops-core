import Page from './page';
import Provider from './provider';
import Parseable from './parseable';
import {
  Console as ConsoleType,
  Provider as ProviderType,
  Page as PageType,
  Widget as WidgetType
} from '@tinystacks/ops-model';
import { FlatMap, Json, YamlConsole, YamlPage, YamlProvider, YamlWidget } from '../types';
import { Widget } from './widget';
import GenericWidget from './generic-widget';

class Console extends Parseable implements ConsoleType {
  name: string;
  pages: { [id: string]: Page };
  providers: { [id: string]: Provider };
  widgets: { [id: string]: Widget };
  dependencies: FlatMap;

  constructor (
    name: string,
    pages: { [id: string]: Page } = {},
    providers: { [id: string]: Provider } = {},
    widgets: { [id: string]: Widget } = {},
    dependencies?: FlatMap
  ) {
    super();
    this.name = name;
    this.pages = pages;
    this.providers = providers;
    this.widgets = widgets;
    this.dependencies = dependencies;
  }

  static fromYaml (yamlJson: YamlConsole): Console {
    const {
      name,
      pages: pagesObject = {},
      providers: providersObject = {},
      widgets: widgetsObject = {},
      dependencies
    } = yamlJson.Console;
    const pages = Object.entries(pagesObject).reduce<{ [id: string]: Page }>((acc, [id, page]) => {
      acc[id] = Page.fromYaml(page, id);
      return acc;
    }, {});
    
    const providers = Object.entries(providersObject).reduce<{ [id: string]: Provider }>((acc, [id, provider]) => {
      acc[id] = provider;
      return acc;
    }, {});
    
    const widgets = Object.entries(widgetsObject).reduce<{ [id: string]: Widget }>((acc, [id, widgetObject]) => {
      // TODO: Replace this with the plugin classes
      acc[id] = GenericWidget.fromYaml(widgetObject, id);
      return acc;
    }, {});
    return new Console(
      name,
      pages,
      providers,
      widgets,
      dependencies
    );
  }
  
  toYaml (): YamlConsole {
    const pages = Object.entries(this.pages).reduce<{ [id: string]: YamlPage }>((acc, [id, page]) => {
      acc[id] = page.toYaml();
      return acc;
    }, {});
    
    const providers = Object.entries(this.providers).reduce<{ [id: string]: YamlProvider }>((acc, [id, provider]) => {
      acc[id] = provider;
      return acc;
    }, {});
    
    const widgets = Object.entries(this.widgets).reduce<{ [id: string]: YamlWidget }>((acc, [id, widget]) => {
      // TODO: Replace this with the plugin classes
      acc[id] = GenericWidget.fromJson(widget).toYaml();
      return acc;
    }, {});
    return {
      Console: {
        name: this.name,
        pages,
        providers,
        widgets,
        dependencies: this.dependencies
      }
    };
  }

  static fromJson (object: ConsoleType): Console {
    const {
      name,
      pages: pagesObject = {},
      providers: providersObject = {},
      widgets: widgetsObject = {},
      dependencies
    } = object;
    const pages = Object.entries(pagesObject).reduce<{ [id: string]: Page }>((acc, [id, page]) => {
      acc[id] = Page.fromJson(page);
      return acc;
    }, {});
    
    const providers = Object.entries(providersObject).reduce<{ [id: string]: Provider }>((acc, [id, provider]) => {
      acc[id] = provider;
      return acc;
    }, {});
    
    const widgets = Object.entries(widgetsObject).reduce<{ [id: string]: Widget }>((acc, [id, widgetObject]) => {
      // TODO: Replace this with the plugin classes
      acc[id] = GenericWidget.fromJson(widgetObject);
      return acc;
    }, {});
    return new Console(
      name,
      pages,
      providers,
      widgets,
      dependencies
    );
  }

  toJson (): Json {
    const pages = Object.entries(this.pages).reduce<{ [id: string]: PageType }>((acc, [id, page]) => {
      acc[id] = page.toJson();
      return acc;
    }, {});
    
    const providers = Object.entries(this.providers).reduce<{ [id: string]: ProviderType }>((acc, [id, provider]) => {
      acc[id] = provider;
      return acc;
    }, {});
    
    const widgets = Object.entries(this.widgets).reduce<{ [id: string]: WidgetType }>((acc, [id, widget]) => {
      // TODO: Replace this with the plugin classes
      acc[id] = GenericWidget.fromJson(widget).toJson();
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

  addPage (page: Page): void {
    this.pages = this.pages || {};
    this.pages[page.id] = page;
  }

  updatePage (page: Page): void {
    this.pages = this.pages || {};
    this.pages[page.id] = page;
  }
  
  deletePage (id: string): void {
    this.pages = this.pages || {};
    delete this.pages[id];
  }
  
  addWidget (widget: Widget): void {
    this.widgets = this.widgets || {};
    this.widgets[widget.id] = widget;
  }

  updateWidget (widget: Widget): void {
    this.widgets = this.widgets || {};
    this.widgets[widget.id] = widget;
  }
  
  deleteWidget (id: string): void {
    this.widgets = this.widgets || {};
    delete this.widgets[id];
  }
}

export default Console;