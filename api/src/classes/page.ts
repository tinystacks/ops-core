import { Page as PageType, Widget as WidgetType } from '@tinystacks/ops-model';
import Parseable from './parseable';
import { YamlPage, YamlWidget } from '../types';

class Page extends Parseable implements PageType {
  id?: string;
  route?: string;
  widgetIds?: string[];

  constructor (
    id?: string, 
    route?: string,
    widgetIds: string[] = []
  ) {
    super();
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
  }
  
  static fromYaml (yamlJson: YamlPage): Page {
    const {
      id,
      route,
      widgetIds = []
    } = yamlJson.Page;
    return new Page(
      id,
      route,
      widgetIds
    );
  }
  
  static toYaml (page: Page): YamlPage {
    const {
      id,
      route,
      widgetIds = []
    } = page;
    return {
      Page: {
        id,
        route,
        widgetIds
      }
    };
  }

  static fromObject (object: PageType): Page {
    const {
      id,
      route,
      widgetIds // TODO: How to map widgets for property filtering, etc.? Do we even need to?
    } = object;
    return new Page(
      id,
      route,
      widgetIds
    );
  }
}

export default Page;