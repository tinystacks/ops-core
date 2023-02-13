import React from 'react';
import Provider from './provider';
import { Widget as WidgetType } from '@tinystacks/ops-model';

abstract class Widget implements WidgetType {
  id: string;
  displayName: string;
  type: string;
  providerId: string;
  provider?: Provider;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;

  constructor (
    id: string,
    displayName: string,
    type: string,
    providerId: string,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean
  ) {
    this.id = id;
    this.displayName = displayName;
    this.type = type;
    this.providerId = providerId;
    this.showDisplayName = showDisplayName;
    this.description = description;
    this.showDescription = showDescription; 
  }

  /**
   * Override this to accept a json object that overlaps with your class's interface and returns an instance of itself.
   */
  static fromJson (_object: WidgetType) {
    throw new Error('Method not implemented.');
  }

  /**
   * Implement this method to return only public properties.
   * Filter out things like functions, private properties, etc.
   */
  abstract toJson (): WidgetType;

  /**
   * Implement this to fetch runtime data.
   * The provider will be attached at this point.
   */
  abstract getData (): void;
 
  abstract render (): JSX.Element;
}

export default Widget;