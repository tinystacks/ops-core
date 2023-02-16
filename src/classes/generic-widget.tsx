import { Widget } from './widget';
import { GenericWidgetType, Json, YamlWidget } from '../types';
import { Parseable } from './parseable';
// import React from 'react';
import {h, Fragment} from 'preact';
export class GenericWidget extends Widget implements GenericWidgetType, Parseable {
  [key: string]: any;
  constructor (object: GenericWidgetType) {
    const {
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    } = object;
    super(
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    );
    for (const [key, value] of Object.entries(object)) {
      this[key] = value;
    }
    // this.myPrivateProp = 'abc';
  }

  static fromJson (object: GenericWidgetType): GenericWidget {
    return new GenericWidget(object);
  }

  toJson (): GenericWidgetType {
    const anonymous: Json = { ...this };
    delete anonymous.getData;
    const {
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    } = anonymous;
    return {
      ...anonymous,
      id,
      displayName,
      type,
      providerId,
      showDisplayName,
      description,
      showDescription
    };
  }

  static fromYaml (yamlJson: YamlWidget, id?: string): GenericWidget {
    const [_, __, ___, providerId] = yamlJson.provider.$ref.split('/');
    return new GenericWidget({
      ...yamlJson,
      providerId,
      id
    });
  }
  
  toYaml (): YamlWidget {
    return {
      id: this.id,
      displayName: this.displayName,
      type: this.type,
      showDisplayName: this.showDisplayName,
      description: this.description,
      showDescription:this.showDescription, 
      tabs: {},
      provider: { $ref: `#/Console/provider/${this.providerId}` }
    };
  }

  getData (): void { return; }

  render (): JSX.Element { return <>TODO</>; }
}