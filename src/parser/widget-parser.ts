import { Parser } from './parser';
import { YamlWidget } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Widget } from '../classes/widget';

export class WidgetParser extends Parser {
  static validate (yamlWidget: YamlWidget): void {
    validatePropertyExists(yamlWidget, 'type', 'Widget');
    validatePropertyExists(yamlWidget, 'displayName', 'Widget');
    validatePropertyExists(yamlWidget, 'provider', 'Widget');
  }

  static parse (yamlWidget: YamlWidget, id?: string, dependencySource?: string): Widget {
    const [_, __, ___, providerId] = yamlWidget.provider.$ref.split('/');
    try { 
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const widgetType = require(dependencySource)[yamlWidget.type];
      const widgetObject = {
        ...yamlWidget, 
        providerId, 
        id
      };
      const widget = widgetType.fromJson(widgetObject);
      return widget; 
    } catch(e){ 
      throw Error(`Error trying to load module ${dependencySource} for type ${yamlWidget.type}`);
    }
  }
}