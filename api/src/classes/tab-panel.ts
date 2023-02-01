import { TabPanel as TabPanelType } from '@tinystacks/ops-model';
import Widget from './widget';
import Tab from './tab';

class TabPanel extends Widget implements TabPanelType {
  tabs: Tab[];

  constructor (
    id: string,
    displayName: string,
    type: string,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: string,
    tabs: Tab[] = []
  ) {
    super(
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription
    );
    this.tabs = tabs;
  }

  static fromObject (object: TabPanelType): TabPanel {
    const {
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription,
      tabs: tabObjects = []
    } = object;
    const tabs = tabObjects.map(Tab.fromObject);
    return new TabPanel(
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription,
      tabs
    );
  }

  getData (): void { return; }
}

export default TabPanel;