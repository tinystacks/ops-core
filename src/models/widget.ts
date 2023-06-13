import { Widget as WidgetType } from '@tinystacks/ops-model';
import { Parsable } from '../types.js';
import { dynamicRequire, validatePropertyExists } from '../parser-utils.js';

export abstract class Widget implements WidgetType, Parsable<WidgetType, Widget> {
  id: string;
  type: string;
  displayName: string;
  displayOptions?: WidgetType['displayOptions'];
  providerIds?: string[];
  childrenIds?: string[];
  description?: string;
  fromJson: (object: WidgetType, dependencySource: string) => Widget | Promise<Widget>;

  constructor (widgetProps: WidgetType) {
    const { id, type, displayName, providerIds, childrenIds, displayOptions, description } = widgetProps;
    this.id = id;
    this.type = type;
    this.displayName = displayName;
    this.providerIds = providerIds;
    this.childrenIds = childrenIds;
    this.description = description;
    this.displayOptions = displayOptions;
    this.fromJson = Widget.fromJson;
  }

  static fromJson (object: WidgetType, dependencySource: string): Promise<Widget> | Widget {
    validatePropertyExists(object, 'id', 'Widget');
    validatePropertyExists(object, 'type', 'Widget');
    validatePropertyExists(object, 'displayName', 'Widget');
    return dynamicRequire<WidgetType, Widget>(object, dependencySource);
  }

  toJson (): WidgetType {
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
}