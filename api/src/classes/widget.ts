import { Widget as WidgetType } from '@tinystacks/ops-model';

abstract class Widget implements WidgetType {
  id?: string;
  displayName?: string;
  type?: string;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: string;

  constructor (
    id?: string,
    displayName?: string,
    type?: string,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: string
  ) {
    this.id = id;
    this.displayName = displayName;
    this.type = type;
    this.showDisplayName = showDisplayName;
    this.description = description;
    this.showDescription = showDescription; 
  }
}

export default Widget;