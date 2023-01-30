import { Tab as TabType } from '@tinystacks/ops-model';
import Widget from './widget';

class Tab extends Widget implements TabType {
  tabDisplayName: string;
  widgets: Widget[];

  constructor (
    id: string,
    displayName: string,
    type: string,
    tabDisplayName: string,
    widgets: Widget[] = [],
    showDisplayName?: boolean,
    description?: string,
    showDescription?: string
  ) {
    super(
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription
    );
    this.tabDisplayName = tabDisplayName;
    this.widgets = widgets;
  }

  static fromObject (object: TabType): Tab {
    const {
      id,
      displayName,
      type,
      tabDisplayName,
      widgets,
      showDisplayName,
      description,
      showDescription
    } = object;
    return new Tab(
      id,
      displayName,
      type,
      tabDisplayName,
      widgets,
      showDisplayName,
      description,
      showDescription
    );
  }
}

export default Tab;