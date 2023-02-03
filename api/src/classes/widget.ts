import { Widget as WidgetType } from '@tinystacks/ops-model';
import Provider from './provider';

abstract class Widget implements WidgetType {
  id: string;
  displayName: string;
  type: string;
  provider?: Provider;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;
  abstract getData (): void;

  constructor (
    id: string,
    displayName: string,
    type: string,
    provider?: Provider,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean
  ) {
    this.id = id;
    this.displayName = displayName;
    this.type = type;
    this.provider = provider;
    this.showDisplayName = showDisplayName;
    this.description = description;
    this.showDescription = showDescription; 
  }

  static fromJson (_object: WidgetType) {
    throw new Error('Method not implemented.');
  }
}

export default Widget;