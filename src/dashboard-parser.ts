import { validatePropertyExists } from './parser-utils.js';
import { Dashboard, YamlDashboard, Parameter } from '@tinystacks/ops-model';

export class DashboardParser implements Dashboard {
  id: string;
  route: string;
  widgetIds: string[];
  parameters: Parameter[];

  constructor (
    route: string,
    widgetIds: string[] = [],
    id: string,
    parameters: Parameter[] = []
  ) {
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
    this.parameters = parameters;
  }

  static parse (yamlDashboard: YamlDashboard, id?:string): Dashboard {

    const {
      route,
      widgets,
      parameters
    } = yamlDashboard;

    const widgetIds = widgets.map((item) => {
      const [_, __, ___, widgetId ] = item.$ref.split('/');
      return widgetId;
    });


    return {
      route,
      widgetIds,
      parameters,
      id
    };
  }

  static fromJson (object: Dashboard): DashboardParser {
    const {
      id,
      route,
      widgetIds,
      parameters
    } = object;

    validatePropertyExists(object, 'widgetIds', 'Dashboard');
    validatePropertyExists(object, 'route', 'Dashboard');

    return new DashboardParser (
      route,
      widgetIds,
      id,
      parameters
    );
  }

  toJson (): Dashboard {

    return {
      id: this.id,
      route: this.route,
      widgetIds: this.widgetIds,
      parameters: this.parameters
    };
  }

  toYaml () {
    // TODO: This is cheap and restrictive, we should store the original ref on the widget and use that here.
    const widgets = this.widgetIds.map(widgetId => ({ $ref: `#/Console/widgets/${widgetId}` }));
    return {
      route: this.route,
      widgets,
      id: this.id,
      parameters: this.parameters
    };
  }

}