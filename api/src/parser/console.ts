import { Ref, YamlConsoleProperties, YamlProvider, YamlWidget } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { Parser } from "./parser";
import { Console as ConsoleType, Page, Provider, Widget } from '@tinystacks/ops-model';
import { Page as PageClass } from "./page";
import { Provider as ProviderClass} from "./provider";
import { Widget as WidgetClass} from "./widget";

export class Console extends Parser implements ConsoleType {
  name: string;
  providers: Record<string, Provider>;
  pages: Record<string, Page>;
  widgets: Record<string, Widget>;

  constructor (
    name: string,
    providers: Record<string, Provider>,
    pages: Record<string, Page>,
    widgets: Record<string, Widget>
  ) {
    super();
    this.name = name;
    this.providers = providers;
    this.pages = pages;
    this.widgets = widgets;
  }
  
  static validate(console: YamlConsoleProperties): void {

    validatePropertyExists(console, 'name', "Console");
    validatePropertyExists(console, 'providers', "Console");
    validatePropertyExists(console, 'pages', "Console");
    validatePropertyExists(console, 'widgets', "Console");

    const allWidgetIds: Ref[] = [];
    const allProviders: Ref[] = [];
    Object.keys(console.pages).forEach(id => { 
      allWidgetIds.push(...console.pages[id].widgets);
    }); 

    Object.keys(console.widgets).forEach(id => { 
      allProviders.push(console.widgets[id].provider);
      if(console.widgets[id].tabs){ 
        Object.keys(console.widgets[id].tabs).forEach(tabId => { 
          allWidgetIds.push(...console.widgets[id].tabs[tabId].widgets);
        })
      }
    });



    validateWidgetReferences(console.widgets, allWidgetIds);
    validateProviderReferences(console.providers, allProviders);
 
  }

  static parse(consoleYaml: YamlConsoleProperties): Console { 
    const { 
      name,
      providers, 
      pages,
      widgets
    } = consoleYaml;

    const pageObjects : Record<string, Page> = {}; 
    Object.keys(pages).forEach(id => { 
      PageClass.validate(pages[id]);
      pageObjects[id] = PageClass.parse(pages[id]);
    });

    const providerObjects: Record<string, Provider> = {}; 
    Object.keys(providers).forEach(id => { 
      ProviderClass.validate(providers[id]);
      providerObjects[id] = ProviderClass.parse(providers[id]);
    });

    const widgetObjects: Record<string, Widget> = {}; 
    Object.keys(widgets).forEach(id => { 
      WidgetClass.validate(widgets[id]);
      widgetObjects[id] = WidgetClass.parse(widgets[id]);
    });

    return new Console(
      name, 
      providerObjects,
      pageObjects,
      widgetObjects
    )


    
  }

}

function validateWidgetReferences(widgets: { [id: string]: YamlWidget} , widgetReferences: Ref[]){ 
  console.log("widgets: ", widgets);
  console.log("references: ", widgetReferences);
  for(let i = 0; i < widgetReferences.length; ++i){ 
    const [_, __, ___, widgetId] = widgetReferences[i].$ref.split("/"); 
    const found = widgets[widgetId];
    if(!found){ 
      throw Error(`Widget reference ${widgetReferences[i]} is not defined`);
    }
  }
}

function validateProviderReferences(providers: { [id: string]: YamlProvider}, providerReferences: Ref[]){ 
  for(let i = 0; i < providerReferences.length; ++i){ 
    const [_, __, ___, providerId] = providerReferences[i].$ref.split("/"); 
    const found = providers[providerId];
    if(!found){ 
      throw Error(`Provider reference ${providerReferences[i]} is not defined`);
    }
  }

}