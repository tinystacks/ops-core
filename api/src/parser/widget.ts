import { ParsingService } from "./parsing-service";
import { YamlWidget } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { Tab, Widget as WidgetType, TabPanel as TabPanelType } from '@tinystacks/ops-model';

export class Widget extends ParsingService implements WidgetType, TabPanelType {
  type: string;
  displayName: string;
  providerId: string;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;
  id?: string;
  tabs?: Tab[];

  constructor (
    type: string, 
    displayName: string,
    providerId: string,
    showDisplayName: boolean,
    description: string,
    showDescription: boolean,
    id: string,
    tabs: Tab[] = []
  ) {
    super();
    this.type = type;
    this.displayName = displayName;
    this.providerId = providerId;
    this.showDisplayName = showDisplayName;
    this.description = description;
    this.showDescription = showDescription;
    this.id = id;
    this.tabs = tabs;
  }
  
  validate(yamlWidget: YamlWidget): void {
    validatePropertyExists(yamlWidget, 'type', "Widget");
    validatePropertyExists(yamlWidget, 'displayName', "Widget");
    validatePropertyExists(yamlWidget, 'provider', "Widget");
  }

  parse(yamlWidget: YamlWidget): Widget{ 
    const { 
      type,
      displayName, 
      showDisplayName, 
      description, 
      showDescription, 
      id, 
      tabs
    } = yamlWidget;

    const [__, _, providerId ] = yamlWidget.provider.$ref.split("/");
    
    return new Widget( 
      type,
      displayName, 
      providerId,
      showDisplayName, 
      description, 
      showDescription, 
      id, 
      tabs, 
    );
  }

}