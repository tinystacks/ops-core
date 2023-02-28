import { validatePropertyExists } from './parser-utils.js';
import { Widget } from '@tinystacks/ops-model';
import { BaseProvider } from './base-provider.js';

// TODO: leave a note that this is a hydrated widget that we actually use in the backend/frontend to do work
// YamlWidget: just for reading and writing config + intellisense
// Widget: for transacting and passing around widgets

export abstract class BaseWidget implements Widget {
  id: string;
  type: string;
  displayName: string;
  displayOptions?: Widget['displayOptions'];
  providerIds?: string[];
  childrenIds?: string[];
  description?: string;

  constructor (widgetProps: Widget) {
    const { id, type, displayName, providerIds, childrenIds, displayOptions, description } = widgetProps;
    this.id = id;
    this.type = type;
    this.displayName = displayName;
    this.providerIds = providerIds;
    this.childrenIds = childrenIds;
    this.description = description;
    this.displayOptions = displayOptions;
  }

  static fromJson (object: Widget, dependencySource?:string): Promise<BaseWidget> | BaseWidget {
    validatePropertyExists(object, 'id', 'Widget');
    validatePropertyExists(object, 'type', 'Widget');
    validatePropertyExists(object, 'displayName', 'Widget');
    return BaseWidget.dynamicRequire(object, dependencySource);
  }

  private static async dynamicRequire (object: Widget, dependencySource?: string): Promise<BaseWidget> {
    try {
      const WidgetType: any = (await import(dependencySource))[object.type];
      const widget = await WidgetType.fromJson(object);
      return widget; 
    } catch(e){ 
      console.error(e);
      throw Error(`Error trying to load module ${dependencySource} for type ${object.type}`);
    }
  }

  toJson (): Widget { 
    return { 
      id: this.id,
      type: this.type, 
      displayName: this.displayName,
      providerIds: this.providerIds,
      childrenIds: this.childrenIds,
      description: this.description,
      displayOptions: this.displayOptions
    };    
  }

  abstract getData (providers?: BaseProvider[], overrides?: any): void | Promise<void>;
  abstract render (children?: (Widget & { renderedElement: JSX.Element })[]): JSX.Element;
}