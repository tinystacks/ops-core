import { validatePropertyExists } from './parser-utils';
import { Widget } from '@tinystacks/ops-model';
import { BaseProvider } from './base-provider';

// TODO: leave a note that this is a hydrated widget that we actually use in the backend/frontend to do work
// YamlWidget: just for reading and writing config + intellisense
// Widget: for transacting and passing around widgets

export abstract class BaseWidget implements Widget {
  id: string;
  type: string;
  displayName: string;
  displayOptions?: Widget['displayOptions'];
  providerIds?: string[];
  description?: string;

  constructor (widgetProps: Widget) {
    const { id, type, displayName, providerIds, displayOptions, description } = widgetProps;
    this.id = id;
    this.type = type;
    this.displayName = displayName;
    this.providerIds = providerIds;
    this.description = description;
    this.displayOptions = displayOptions;
  }

  static fromJson (object: Widget, dependencySource?:string): Promise<BaseWidget> | BaseWidget {
    validatePropertyExists(object, 'id', 'Widget');
    validatePropertyExists(object, 'type', 'Widget');
    validatePropertyExists(object, 'displayName', 'Widget');

    return import(dependencySource)
      .then(source => source[object.type].fromJson(object))
      .catch((e) => {
        console.error(e);
        throw Error(`Error trying to load module ${dependencySource} for type ${object.type}`);
      });

    // try { 
    //   const WidgetType: any = (await import(dependencySource))[object.type];
    //   const widget = await WidgetType.fromJson(object);
    //   return widget; 
    // } catch(e){ 
    //   throw Error(`Error trying to load module ${dependencySource} for type ${object.type}`);
    // }
  }

  toJson (): Widget { 
    return { 
      id: this.id,
      type: this.type, 
      displayName: this.displayName,
      providerIds: this.providerIds,
      description: this.description,
      displayOptions: this.displayOptions
    };    
  }

  abstract getData (providers?: BaseProvider[], overrides?: any): void | Promise<void>;
  abstract render (children?: BaseWidget[]): JSX.Element;
}