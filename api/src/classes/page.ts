import { Page as PageType, Widget as WidgetType } from '@tinystacks/ops-model';
import Widget from './widget';
import Parseable from './parseable';
import { YamlPage, YamlWidget } from '../types';

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
  
  static fromYaml(yamlJson: YamlPage): Page {
    const {
      route,
      widgets: widgetObjects = []
    } = yamlJson.Page;
    const widgets = widgetObjects.map((widgetObject: YamlWidget) => {
      const [type, properties]: [string, WidgetType] = Object.entries(widgetObject)?.at(0);
      return {
        ...properties,
        type
      };
    });
    return new Page(
      route,
      widgets
    );
  }
  
  static toYaml(page: Page): YamlPage {
    const {
      route,
      widgets: widgetObjects = []
    } = page;
    const widgets = widgetObjects.map<YamlWidget>((widgetObject: WidgetType) => {
      const { type } = widgetObject;
      return {
        [type]: widgetObject
      };
    });
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
      widgets // TODO: How to map widgets for property filtering, etc.? Do we even need to?
    } = object;
    return new Page(
      route,
      widgets
    );
  }
}

export default Page;