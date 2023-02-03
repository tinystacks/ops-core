import { Tab as TabType } from '@tinystacks/ops-model';
import Widget from './widget';

class Tab extends Widget implements TabType {
  tabDisplayName: string;
  widgetIds: string[];

  constructor (
    id: string,
    displayName: string,
    type: string,
    tabDisplayName: string,
    widgetIds: string[] = [],
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean
  ) {
    super(
      id,
      displayName,
      type,
      undefined,
      showDisplayName,
      description,
      showDescription
    );
    this.tabDisplayName = tabDisplayName;
    this.widgetIds = widgetIds;
  }

  static fromJson (object: TabType): Tab {
    const {
      id,
      displayName,
      type,
      tabDisplayName,
      widgetIds,
      showDisplayName,
      description,
      showDescription
    } = object;
    return new Tab(
      id,
      displayName,
      type,
      tabDisplayName,
      widgetIds,
      showDisplayName,
      description,
      showDescription
    );
  }

  getData (): void { return; }
}

export default Tab;