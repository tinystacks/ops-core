import { Page as PageType, Widget as WidgetType } from '@tinystacks/ops-model';
import Widget from './widget';
import Parseable from './parseable';
import { GenericWidgetType, YamlPage, YamlWidget } from '../types';
import GenericWidget from './generic-widget';

class Page extends Parseable implements PageType {
  route: string;
  widgets: Widget[];

  constructor (
    route: string,
    widgets: Widget[] = []
  ) {
    super();
    this.route = route;
    this.widgets = widgets;
  }
  
  static fromYaml (yamlJson: YamlPage): Page {
    const {
      route,
      widgets: widgetObjects = []
    } = yamlJson.Page;
    const widgets = widgetObjects.map(GenericWidget.fromYaml);
    return new Page(
      route,
      widgets
    );
  }
  
  static toYaml (page: Page): YamlPage {
    const {
      route,
      widgets: widgetClasses = []
    } = page;
    const widgets: YamlWidget[] = widgetClasses.map(GenericWidget.toYaml);
    return {
      Page: {
        route,
        widgets
      }
    };
  }

  static fromObject (object: PageType): Page {
    const {
      route,
      widgets: widgetObjects = []
    } = object;
    const widgets = widgetObjects.map(GenericWidget.fromObject)
    return new Page(
      route,
      widgets
    );
  }
}

export default Page;