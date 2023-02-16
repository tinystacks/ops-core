import { Parser } from './parser';
import { YamlPage, YamlWidget } from '../types';
import { validatePropertyExists } from './parser-utils';
import { Widget as WidgetType } from '@tinystacks/ops-model';
import { Widget } from '../classes/widget';
import { Json } from '../types';

export class WidgetParser extends Parser implements WidgetType {
  type: string;
  displayName: string;
  providerId: string;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;
  id?: string;


  constructor (
    type: string,
    displayName: string,
    providerId: string,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean,
    id?: string

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

  static parse (yamlWidget: YamlWidget, id?: string): WidgetType & Record<string, any> {
    const {
      type,
      displayName,
      showDisplayName,
      description,
      showDescription
    } = yamlWidget;

    const [_, __, ___, providerId] = yamlWidget.provider.$ref.split('/');

    const widget  = new WidgetParser(
      type,
      displayName,
      providerId,
      showDisplayName,
      description,
      showDescription,
      id
    );

    return { ...widget, ...yamlWidget };
  }

  static fromJson (object: Json, dependencySource? :string): Widget {

    validatePropertyExists(object, 'type', 'Widget');
    validatePropertyExists(object, 'displayName', 'Widget');
    validatePropertyExists(object, 'providerId', 'Widget');

    try { 
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const widgetType = require(dependencySource)[object.type];
      const widget = widgetType.fromJson(object);
      return widget; 
    } catch(e){ 
      throw Error(`Error trying to load module ${dependencySource} for type ${object.type}`);
    }
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

  static toYaml (widget: WidgetType & Record<string, any>): YamlWidget {

    return {
      id: widget.id,
      displayName: widget.displayName,
      type: widget.type,
      showDisplayName: widget.showDisplayName,
      description: widget.description,
      showDescription:widget.showDescription, 
      tabs: {},
      provider: { $ref: `#/Console/provider/${widget.providerId}`, 
        ...widget }
    };
  }

  getData (): void { return; }
}