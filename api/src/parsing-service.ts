import { Widget } from '@tinystacks/ops-model';
import { get, isNil } from 'lodash';
import { YamlConsole, YamlPage, YamlPageProperties, YamlWidget } from './types';

export class ParsingService {

  public loadYamlFromFile(filePath: string): YamlConsole {
    //need to implement this
    return undefined;
  };
  
  
  public parseYaml(yaml: YamlConsole) { 
    const allWidgetIds = Array<string>(); 
    yaml.Console.pages.forEach(page => { 
      allWidgetIds.push(...page.Page.widgetIds);
    });

    yaml.Console.widgets.forEach(widget  => { 
      if(widget.tabs){ 
        widget.tabs.forEach(tab => { 
          allWidgetIds.push(...tab.widgetIds);
        })
      }
    }); 

    const widgets = this.parseAndValidateWidgets(yaml.Console.widgets, allWidgetIds);
    const pages = this.parseAndValidatePages(yaml.Console.pages);

    return { 
      pages,
      widgets
    }

  }

  public parseAndValidatePages(pages: Array<YamlPage>){ 

    const flatPages =  pages.map(page => { 
      return page.Page;
    });

    this.validatePropertiesOnPages(flatPages);
    return flatPages;
  }

  public parseAndValidateWidgets(widgets: Array<YamlWidget>, allWidgetIds: Array<string>) { 
   
    this.validatePropertiesOnWidgets(widgets); 
    this.validateUniqueIdsForWidgets(widgets);
    this.validateAllWidgetsDefined(allWidgetIds, widgets);

    return widgets;

  }

  public validatePropertiesOnWidgets(widgets: Array<Widget>){ 
    widgets.forEach(widget => { 
      //this.validatePropertyExists(widget, 'displayName');
      //this.validatePropertyExists(widget, 'description'); 
      // can validate more properties in future but based off example these are sufficient
      this.validatePropertyExists(widget, 'type', "Widget");
      this.validatePropertyExists(widget, 'id', "Widget");
      
    });
  }

  private validatePropertiesOnPages(pages: Array<YamlPageProperties>){ 
    pages.forEach(page => { 
      this.validatePropertyExists(page, 'id', "Page");
      this.validatePropertyExists(page, 'route', "Page");
    })
  }

  private validatePropertyExists(obj: any, propertyName: string, objectType: string){ 
    const propertyValue = get(obj, propertyName);
    if (isNil(propertyValue)) {
      throw Error(`Error validating property ${propertyName} on object ${objectType}`)
    }
    return
  }

  //To-Do: Make this more generic
  public validateUniqueIdsForWidgets(widgets: Array<Widget>){ 
    const uniqueIds = new Set(widgets.map(widget => widget.id));   
    if([...uniqueIds].length !== widgets.length) { 
      throw Error("Error found overlapping ids in Widgets")
    }
  }

  public validateAllWidgetsDefined(widgetIds: string[], widgets: Array<Widget>){
    for(let i = 0; i<widgetIds.length; ++i){ 
      const found = widgets.find(widget => widget.id === widgetIds[i]); 
      if(found){ 
        //do nothing
      }
      else{ 
        throw Error(`Widget with id ${widgetIds[i]} is not defined`);
      }
    }

  }
}

