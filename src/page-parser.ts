import { validatePropertyExists } from './parser-utils';
import { Page, YamlPage } from '@tinystacks/ops-model';

export class PageParser implements Page {
  id: string;
  route: string;
  widgetIds: string[];

  constructor (
    route: string,
    widgetIds: string[] = [], 
    id: string
  ) {
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
  }

  static parse (yamlPage: YamlPage, id?:string): Page { 

    const {
      route,
      widgets
    } = yamlPage; 

    const widgetIds = widgets.map((item) => { 
      const [_, __, ___, widgetId ] = item.$ref.split('/');
      return widgetId;
    });

  
    return {
      route, 
      widgetIds, 
      id
    };
  }

  static fromJson (object: Page): PageParser {
    const { 
      id,
      route,
      widgetIds
    } = object; 

    validatePropertyExists(object, 'widgetIds', 'Page');
    validatePropertyExists(object, 'route', 'Page'); 

    return new PageParser (
      route, 
      widgetIds, 
      id
    );
  }

  toJson (): Page { 

    return { 
      id: this.id, 
      route: this.route, 
      widgetIds: this.widgetIds
    };
  }

  static toYaml (page: Page) {
    const { 
      route, 
      widgetIds,
      id
    } = page;
    // TODO: This is cheap and restrictive, we should store the original ref on the widget and use that here.
    const widgets = widgetIds.map(widgetId => ({ $ref: `#/Console/widgets/${widgetId}` }));
    return {
      route,
      widgets,
      id 
    };
  }

}