import { Page as PageType } from '@tinystacks/ops-model';
import Parseable from './parseable';
import { YamlPage, Ref } from '../types';

class Page extends Parseable implements PageType {
  route: string;
  widgetIds: string[];
  id?: string;

  constructor (
    route: string,
    widgetIds: string[] = [],
    id?: string
  ) {
    super();
    this.id = id;
    this.route = route;
    this.widgetIds = widgetIds;
    this.id = id;
  }
  
  static fromYaml (yamlJson: YamlPage, id?: string): Page {
    const {
      route,
      widgets
    } = yamlJson;
    const widgetIds = widgets.map((widget: Ref) => {
      const ref = widget.$ref;
      const [_hash, _console, _widgets, widgetId, ...rest] = ref.split('/');
      if (!ref || !widgetId || (Array.isArray(rest) && rest.length > 0)) {
        throw new Error('Invalid widget reference! Widgets must be local references i.e. "#/Console/widgets/{WidgetId}"!');
      }
      return widgetId;
    });
    return new Page(
      route,
      widgetIds, 
      id
    );
  }
  
  toYaml (): YamlPage {
    // This is cheap and restrictive, we should store the original ref on the widget and use that here.
    const widgets = this.widgetIds.map(widgetId => ({ $ref: `#/Console/widgets/${widgetId}` }));
    return {
      route: this.route,
      widgets
    };
  }

  static fromJson (object: PageType): Page {
    const {
      route,
      widgetIds,
      id
    } = object;
    return new Page(
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

export default Page;