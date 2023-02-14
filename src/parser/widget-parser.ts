import { Parser } from './parser';
import { YamlWidget } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Widget as WidgetType } from '@tinystacks/ops-model';
import { Widget } from '../classes/widget';
import { GenericWidget } from '../classes/generic-widget';

export class WidgetParser extends Parser implements WidgetType {
  type: string;
  displayName: string;
  providerId: string;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;
  id: string;


  constructor (
    type: string,
    displayName: string,
    providerId: string,
    showDisplayName: boolean,
    description: string,
    showDescription: boolean,
    id: string

  ) {
    super();
    this.type = type;
    this.displayName = displayName;
    this.providerId = providerId;
    this.showDisplayName = showDisplayName;
    this.description = description;
    this.showDescription = showDescription;
    this.id = id;

  }

  static validate (yamlWidget: YamlWidget): void {
    validatePropertyExists(yamlWidget, 'type', 'Widget');
    validatePropertyExists(yamlWidget, 'displayName', 'Widget');
    validatePropertyExists(yamlWidget, 'provider', 'Widget');
  }

  static parse (yamlWidget: YamlWidget, id?: string, dependencySource?: string): Widget {
    const [_, __, ___, providerId] = yamlWidget.provider.$ref.split('/');
    try { 
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

  static fromJson (object: WidgetType): Widget {
    const {
      type,
      displayName,
      providerId,
      showDisplayName,
      description,
      showDescription,
      id
    } = object;

    return new GenericWidget({
      type,
      displayName,
      providerId,
      showDisplayName,
      description,
      showDescription,
      id
    });
  }

  toJson (): WidgetType { 

    return { 
      id: this.id,
      type: this.type, 
      displayName: this.displayName,
      providerId: this.providerId,
      showDisplayName: this.showDisplayName,
      description: this.description,
      showDescription: this.showDescription
    };
    
  }

}