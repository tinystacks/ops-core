import { Widget } from '@tinystacks/ops-model';
import { Parsable } from '../types.js';
import { dynamicRequire, validatePropertyExists } from '../parser-utils.js';

export abstract class WidgetModel implements Widget, Parsable<Widget, WidgetModel> {
  id: string;
  type: string;
  displayName: string;
  displayOptions?: Widget['displayOptions'];
  providerIds?: string[];
  childrenIds?: string[];
  description?: string;
  fromJson: (object: Widget, dependencySource: string) => WidgetModel | Promise<WidgetModel>;

  constructor (widgetProps: Widget) {
    const { id, type, displayName, providerIds, childrenIds, displayOptions, description } = widgetProps;
    this.id = id;
    this.type = type;
    this.displayName = displayName;
    this.providerIds = providerIds;
    this.childrenIds = childrenIds;
    this.description = description;
    this.displayOptions = displayOptions;
    this.fromJson = WidgetModel.fromJson;
  }

  static fromJson (object: Widget, dependencySource: string): Promise<WidgetModel> | WidgetModel {
    validatePropertyExists(object, 'id', 'Widget');
    validatePropertyExists(object, 'type', 'Widget');
    validatePropertyExists(object, 'displayName', 'Widget');
    return dynamicRequire<Widget, WidgetModel>(object, dependencySource);
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
}