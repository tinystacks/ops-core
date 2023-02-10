import { YamlPage } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { Parser } from "./parser";
import { Page as PageType } from '@tinystacks/ops-model';

export class Page extends Parser implements PageType {

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
  
  static validate(yamlPage: YamlPage): void {
    validatePropertyExists(yamlPage, 'widgets', "Page");
    validatePropertyExists(yamlPage, 'route', "Page"); 
  }

  static parse(yamlPage: YamlPage): Page{ 

    const { 
      id,
      route,
      widgets
    } = yamlPage; 

    const widgetIds = widgets.map(item => { 
      const [_, __, ___, id ] = item.$ref.split("/");
      return id;
    })

    return new Page(
      id, 
      route, 
      widgetIds
    )
  }

  static fromJson (object: PageType): Page {
    const { 
      id,
      route,
      widgetIds
    } = object; 

    return new Page(
      id, 
      route, 
      widgetIds
    )
  }

  toJson(): PageType { 

    return { 
      id: this.id, 
      route: this.route, 
      widgetIds: this.widgetIds
    }
    
  }

}