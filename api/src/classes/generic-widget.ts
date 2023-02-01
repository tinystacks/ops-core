import Widget from './widget';
import { Widget as WidgetType } from '@tinystacks/ops-model';
import { GenericWidgetType, Json, YamlWidget } from '../types';
import Parseable from './parseable';

class GenericWidget extends Widget implements GenericWidgetType, Parseable {
  [key: string]: any;
  constructor (object: GenericWidgetType) {
    const {
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription
    } = object;
    super(
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription
    );
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
  }

  static fromObject (object: GenericWidgetType): GenericWidget {
    return new GenericWidget(object);
  }

  static toObject (widget: GenericWidget): GenericWidgetType {
    const anonymous: Json = { ...widget };
    delete anonymous.getData;
    const {
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription
    } = anonymous;
    return {
      ...anonymous,
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription
    };
  }

  static fromYaml (yamlJson: YamlWidget): GenericWidget {
    const [type, properties]: [string, WidgetType] = Object.entries(yamlJson).at(0);
    return new GenericWidget({
      ...properties,
      type
    });
  }
  
  static toYaml (widget: GenericWidget): YamlWidget {
    const { type } = widget;
    return {
      [type]: widget
    };
  }

  getData (): void { return; }
}

export default GenericWidget;