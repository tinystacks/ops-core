import Page from './page';
import Provider from './provider';
import Parseable from './parseable';
import { Console as ConsoleType, Provider as ProviderType } from '@tinystacks/ops-model';
import { Json, YamlConsole, YamlProvider } from '../types';
import Widget from './widget';
import GenericWidget from './generic-widget';

class Console extends Parseable implements ConsoleType {
  name: string;
  pages: Page[];
  providers: Provider[];
  widgets: Widget[];

  constructor (
    name: string,
    pages: Page[] = [],
    providers: Provider[] = [],
    widgets: Widget[] = []
  ) {
    super();
    this.name = name;
    this.pages = pages;
    this.providers = providers;
    this.widgets = widgets;
  }

  static fromYaml (yamlJson: YamlConsole): Console {
    const {
      name,
      pages: pageObjects = [],
      providers: providerObjects = [],
      widgets: widgetObjects = []
    } = yamlJson.Console;
    const pages = pageObjects.map(Page.fromYaml);
    const providers = providerObjects.map((providerObject: YamlProvider) => {
      const [type, properties]: [string, ProviderType] = Object.entries(providerObject).at(0);
      return {
        ...properties,
        type
      };
    });
    const widgets = widgetObjects.map(GenericWidget.fromYaml)
    return new Console(
      name,
      pages,
      providers,
      widgets
    );
  }
  
  static toYaml (console: Console): YamlConsole {
    const {
      name,
      pages: pageObjects = [],
      providers: providerObjects = [],
      widgets: widgetObjects = []
    } = console;
    const pages = pageObjects.map(Page.toYaml);
    const providers = providerObjects.map((providerObject: ProviderType & Json) => {
      const { type } = providerObject;
      return {
        [type]: providerObject
      };
    });
    const widgets = widgetObjects.map(GenericWidget.toYaml);
    return {
      Console: {
        name,
        pages,
        providers,
        widgets
      }
    };
  }

  static fromObject (object: ConsoleType): Console {
    const {
      name,
      pages: pageObjects = [],
      providers,
      widgets: widgetObjects = []
    } = object;
    const pages = pageObjects.map(Page.fromObject);
    const widgets = widgetObjects.map(GenericWidget.fromObject);
    return new Console(
      name,
      pages,
      providers,
      widgets
    );
  }

  addPage (page: Page): void {
    this.pages = this.pages || [];
    this.pages.push(page);
  }

  updatePage (index: number, page: Page): void {
    this.pages = this.pages || [];
    this.pages[index] = page;
  }
  
  deletePage (pageRoute: string): void {
    this.pages = this.pages || [];
    this.pages = this.pages.filter(page => page.route !== pageRoute);
  }
  
  addWidget (widget: Widget): void {
    this.widgets = this.widgets || [];
    this.widgets.push(widget);
  }

  updateWidget (index: number, widget: Widget): void {
    this.widgets = this.widgets || [];
    this.widgets[index] = widget;
  }
  
  deleteWidget (id: string): void {
    this.widgets = this.widgets || [];
    this.widgets = this.widgets.filter(widget => widget.id !== id);
  }
}

export default Console;