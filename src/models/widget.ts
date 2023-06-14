import { Widget as WidgetType } from '@tinystacks/ops-model';
import { dynamicRequire, validatePropertyExists } from '../parser-utils.js';
import { Parsable } from '../core/parsable.js';
import { Typed } from '../types.js';

export abstract class Widget extends Parsable implements WidgetType, Typed {
  id: string;
  type: string;
  displayName: string;
  displayOptions?: WidgetType['displayOptions'];
  providerIds?: string[];
  childrenIds?: string[];
  description?: string;

  constructor (widgetProps: WidgetType) {
    super();
    const { id, type, displayName, providerIds, childrenIds, displayOptions, description } = widgetProps;
    this.id = id;
    this.type = type;
    this.displayName = displayName;
    this.providerIds = providerIds;
    this.childrenIds = childrenIds;
    this.description = description;
    this.displayOptions = displayOptions;
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