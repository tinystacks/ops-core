import { YamlPage } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Parser } from './parser';
import { Page as PageType } from '@tinystacks/ops-model';

export class PageParser extends Parser implements PageType {
  id?: string;
  route: string;
  widgetIds: string[];

  constructor (
    route: string,
    widgetIds: string[] = [], 
    id?: string
  ) {
    super();
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
  }

  static parse (yamlPage: YamlPage): PageType { 

    const { 
      id,
      route,
      widgets
    } = yamlPage; 

    const widgetIds = widgets.map((item) => { 
      const [_, __, ___, widgetId ] = item.$ref.split('/');
      return widgetId;
    });

    return {
      id, 
      route, 
      widgetIds
    };
  }

  //this one is done!
  static fromJson (object: PageType): PageParser {
    const { 
      id,
      route,
      widgetIds
    } = object; 

    validatePropertyExists(object, 'widgets', 'Page');
    validatePropertyExists(object, 'route', 'Page'); 

    return new PageParser (
      route, 
      widgetIds, 
      id
    );
  }

  toJson (): PageType { 

    return { 
      id: this.id, 
      route: this.route, 
      widgetIds: this.widgetIds
    };
  }

}