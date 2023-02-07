import { YamlPage } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { ParsingService } from "./parsing-service";
import { Page as PageType } from '@tinystacks/ops-model';

export class Page extends ParsingService implements PageType {

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

}