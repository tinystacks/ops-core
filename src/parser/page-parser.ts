import { YamlPage } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Parser } from './parser';
import { Page as PageType } from '@tinystacks/ops-model';

export class PageParser extends Parser {

  id: string;
  route: string;
  widgetIds: string[];

  constructor (
    id: string, 
    route: string,
    widgetIds: string[] = []
  ) {
    super();
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
  }
  
  static validate (yamlPage: YamlPage): void {
    validatePropertyExists(yamlPage, 'widgets', 'Page');
    validatePropertyExists(yamlPage, 'route', 'Page'); 
  }

  static parse (yamlPage: YamlPage): PageType { 
    const {
      id,
      route,
      widgets
    } = yamlPage; 

    const widgetIds = widgets.map((item) => { 
      const [_, __, ___, refId ] = item.$ref.split('/');
      return refId ;
    });

    return {
      id, 
      route, 
      widgetIds
    };
  }
}