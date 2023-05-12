import { validatePropertyExists } from './parser-utils.js';
import { Dashboard, Parameter } from '@tinystacks/ops-model';

export class DashboardParser implements Dashboard {
  id: string;
  route: string;
  widgetIds: string[];
  parameters: Parameter[];
  description?: string;

  constructor (
    route: string,
    widgetIds: string[] = [],
    id: string,
    parameters: Parameter[] = [],
    description?: string
  ) {
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
    this.parameters = parameters;
    this.description = description;
  }

  static fromJson (object: Dashboard): DashboardParser {
    const {
      id,
      route,
      widgetIds,
      parameters,
      description
    } = object;

    validatePropertyExists(object, 'widgetIds', 'Dashboard');
    validatePropertyExists(object, 'route', 'Dashboard');

    return new DashboardParser (
      route,
      widgetIds,
      id,
      parameters,
      description
    );
  }

  toJson (): Dashboard {

    return {
      id: this.id,
      route: this.route,
      widgetIds: this.widgetIds,
      parameters: this.parameters,
      description: this.description
    };
  }

  toYaml () {
    // TODO: This is cheap and restrictive, we should store the original ref on the widget and use that here.
    const widgets = this.widgetIds.map(widgetId => ({ $ref: `#/Console/widgets/${widgetId}` }));
    return {
      route: this.route,
      widgets,
      id: this.id,
      parameters: this.parameters,
      description: this.description
    };
  }
}