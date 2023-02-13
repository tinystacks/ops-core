import {
  TabPanel as TabPanelType,
  Tab as TabType
} from '@tinystacks/ops-model';
import Widget from './widget';
import Tab from './tab';

class TabPanel extends Widget implements TabPanelType {
  tabs: {
    [id: string]: Tab
  };

  constructor (
    id: string,
    displayName: string,
    type: string,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean,
    tabs: {
      [id: string]: Tab
    } = {}
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
    this.tabs = tabs;
  }

  static fromJson (object: TabPanelType): TabPanel {
    const {
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription,
      tabs: tabsObject = {}
    } = object;
    const tabs = Object.entries(tabsObject).reduce<{ [id: string]: Tab }>((acc, [id, tabObject]) => {
      acc[id] = Tab.fromJson(tabObject);
      return acc;
    }, {});
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

  toJson (): TabPanelType {
    const tabs = Object.entries(this.tabs).reduce<{ [id: string]: TabType }>((acc, [id, tab]) => {
      acc[id] = tab.toJson();
      return acc;
    }, {});

    const {
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription,
      providerId
    } = this;
    return {
      id,
      displayName,
      type,
      showDisplayName,
      description,
      showDescription,
      providerId,
      tabs
    };
  }

  getData (): void { return; }
}

export default TabPanel;