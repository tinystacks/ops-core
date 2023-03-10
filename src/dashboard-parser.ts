import { validatePropertyExists } from './parser-utils.js';
import { Dashboard, YamlDashboard } from '@tinystacks/ops-model';

export class DashboardParser implements Dashboard {
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

  static parse (yamlDashboard: YamlDashboard, id?:string): Dashboard { 

    const {
      route,
      widgets
    } = yamlDashboard; 

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

  static fromJson (object: Dashboard): DashboardParser {
    const { 
      id,
      route,
      widgetIds
    } = object; 

    validatePropertyExists(object, 'widgetIds', 'Dashboard');
    validatePropertyExists(object, 'route', 'Dashboard'); 

    return new DashboardParser (
      route, 
      widgetIds, 
      id
    );
  }

  toJson (): Dashboard { 

    return { 
      id: this.id, 
      route: this.route, 
      widgetIds: this.widgetIds
    };
  }

  toYaml () {
    // TODO: This is cheap and restrictive, we should store the original ref on the widget and use that here.
    const widgets =this. widgetIds.map(widgetId => ({ $ref: `#/Console/widgets/${widgetId}` }));
    return {
      route: this.route,
      widgets,
      id: this.id
    };
  }

}