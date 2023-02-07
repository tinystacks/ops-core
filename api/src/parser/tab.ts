import { ParsingService } from "./parsing-service";
import { YamlTab, YamlWidget } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { Tab as TabType } from '@tinystacks/ops-model';

export class Tab extends ParsingService implements TabType {
  type: string;
  displayName: string;
  providerId: string;
  widgetIds: string[];
  tabDisplayName: string;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;
  id?: string;

  constructor(
    type: string, 
    displayName: string,
    providerId: string,
    showDisplayName: boolean,
    description: string,
    showDescription: boolean,
    id: string,
    tabDisplayName: string,
    widgetIds: Array<string>
  ) {
    super();
    this.type = type;
    this.displayName = displayName;
    this.providerId = providerId;
    this.showDisplayName = showDisplayName;
    this.description = description;
    this.showDescription = showDescription;
    this.id = id;
    this.tabDisplayName = tabDisplayName;
    this.widgetIds = widgetIds;
  }

  static validate(yamlWidget: YamlWidget): void {
    validatePropertyExists(yamlWidget, 'tabDisplayName', "Tab");
    //validatePropertyExists(yamlWidget, 'type', "Tab");
    //validatePropertyExists(yamlWidget, 'displayName', "Tab");
    //validatePropertyExists(yamlWidget, 'provider', "Tab");
    validatePropertyExists(yamlWidget, 'widgets', "Tab");
  }

  static parse(yamlTab: YamlTab): Tab {
    const {
      type,
      displayName,
      showDisplayName, 
      description, 
      showDescription, 
      id, 
      tabDisplayName,
      widgets
    } = yamlTab;
    console.log("tab: ", yamlTab);

    const widgetIds = widgets.map(item => {
      const [_, __, ___, id] = item.$ref.split("/");
      return id;
    })

    return new Tab(
      type,
      displayName, 
      undefined,
      showDisplayName, 
      description, 
      showDescription, 
      id, 
      tabDisplayName,
      widgetIds
    )
  }
}