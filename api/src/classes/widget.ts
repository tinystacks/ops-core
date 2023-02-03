import { Widget as WidgetType } from '@tinystacks/ops-model';
import Provider from './provider';

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

  static fromJson (_object: WidgetType) {
    throw new Error('Method not implemented.');
  }

  abstract toJson (): WidgetType;

  abstract getData (): void;
}

export default Widget;