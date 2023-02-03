import { YamlConsoleProperties } from "../types";
import { validatePropertyExists } from "./parser-utils";
import { ParsingService } from "./parsing-service";
import { Console as ConsoleType, Page, Provider, Widget } from '@tinystacks/ops-model';
import { Page as PageClass } from "./page";
import { Provider as ProviderClass} from "./provider";
import { Widget as WidgetClass} from "./widget";

export class Console extends ParsingService implements ConsoleType {
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
  
  validate(console: YamlConsoleProperties): void {

    validatePropertyExists(console, 'name', "Console");
    validatePropertyExists(console, 'providers', "Console"); //validate non empty
    validatePropertyExists(console, 'pages', "Console"); //validate non empty
    validatePropertyExists(console, 'widgets', "Console"); //validate non empty

    //this.validateWidgetReferences
    //this.validateProviderReferences
 
  }

  parse(consoleYaml: YamlConsoleProperties): Console { 
    console.log("console: ", consoleYaml);
    const { 
      name,
      providers, 
      pages,
      widgets
    } = consoleYaml;

    const pageObjects : Record<string, Page> = {}; 
    Object.keys(pages).forEach(id => { 
      pageObjects[id] = PageClass.parse(pages[id]);
    });

    const providerObjects: Record<string, Provider> = {}; 
    Object.keys(providers).forEach(id => { 
      providerObjects[id] = ProviderClass.parse(providers[id]);
    });

    const widgetObjects: Record<string, Widget> = {}; 
    Object.keys(widgets).forEach(id => { 
      widgetObjects[id] = WidgetClass.parse(widgets[id]);
    });

    return new Console(
      name, 
      providerObjects,
      pageObjects,
      widgetObjects
    )


    
  }

  validateWidgetReferences(widgets:Map<string, Page>, widgetReferences: Array<string>){ 
    for(let i = 0; i<widgetReferences.length; ++i){ 
      const found = widgets.get(widgetReferences[i]); 
      if(!found){ 
        throw Error(`Widget with id ${widgetReferences[i]} is referenced but not defined`);
      }
    }
  }

  validateProviderReferences(providers:Map<string, Provider>, providerReferences: Array<string>){ 

  }

}