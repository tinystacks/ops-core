import { Page as PageType } from '@tinystacks/ops-model';
import Parseable from './parseable';
import { YamlPage } from '../types';

class Page extends Parseable implements PageType {
  route: string;
  widgetIds: string[];

  constructor (
    route: string,
    widgetIds: string[] = []
  ) {
    super();
    this.route = route;
    this.widgetIds = widgetIds;
  }
  
  static fromYaml (yamlJson: YamlPage): Page {
    const {
      route,
      widgetIds
    } = yamlJson.Page;
    return new Page(
      route,
      widgetIds
    );
  }
  
  static toYaml (page: Page): YamlPage {
    const {
      route,
      widgetIds
    } = page;
    return {
      Page: {
        route,
        widgetIds
      }
    };
  }

  static fromObject (object: PageType): Page {
    const {
      route,
      widgetIds
    } = object;
    return new Page(
      route,
      widgetIds
    );
  }
}

export default Page;