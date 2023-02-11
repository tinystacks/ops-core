import { Parser } from "./parser";
import { YamlWidget } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { Tab, Widget as WidgetType, TabPanel as TabPanelType } from '@tinystacks/ops-model';
import { Tab as TabClass } from './tab';
import isNil from "lodash.isnil";

export class Widget extends Parser implements WidgetType, TabPanelType {
  type: string;
  displayName: string;
  providerId: string;
  showDisplayName?: boolean;
  description?: string;
  showDescription?: boolean;
  id: string;
  tabs: Record<string, Tab>

  constructor(
    type: string,
    displayName: string,
    providerId: string,
    showDisplayName: boolean,
    description: string,
    showDescription: boolean,
    id: string,
    tabs?: Record<string, Tab> 
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

  static validate(yamlWidget: YamlWidget): void {
    validatePropertyExists(yamlWidget, 'type', "Widget");
    validatePropertyExists(yamlWidget, 'displayName', "Widget");
    validatePropertyExists(yamlWidget, 'provider', "Widget");
  }

  static parse(yamlWidget: YamlWidget, id?: string, dependencySource?: string): Widget {
    const tabs = yamlWidget.tabs;
    const [_, __, ___, providerId] = yamlWidget.provider.$ref.split("/");
    const tabObjects: Record<string, Tab> = {};
    if (!isNil(tabs)) {
      Object.keys(tabs).forEach(id => {
        TabClass.validate(tabs[id]);
        tabObjects[id] = TabClass.parse(tabs[id]);
      });
    }

    try { 
      const widgetType = require(dependencySource)[yamlWidget.type];
      const widgetObject = {
        ...yamlWidget, 
        providerId, 
        id,
        tabs
      };
      const widget = widgetType.fromJson(widgetObject);
      return widget; 
    } catch(e){ 
      throw Error(`Error trying to load module ${dependencySource} for type ${yamlWidget.type}`);
    }
  }

  static fromJson (object: WidgetType): Widget {
    const {
      type,
      displayName,
      providerId,
      showDisplayName,
      description,
      showDescription,
      id
    } = object;

    return new Widget(
      type,
      displayName,
      providerId,
      showDisplayName,
      description,
      showDescription,
      id
    );
  }

  toJson(): WidgetType { 

    return { 
      id: this.id,
      type: this.type, 
      displayName: this.displayName,
      providerId: this.providerId,
      showDisplayName: this.showDisplayName,
      description: this.description,
      showDescription: this.showDescription,
    }
    
  }

}