import get from 'lodash.get';
import isNil from 'lodash.isnil';
import { Console as ConsoleType, Provider, Widget } from '@tinystacks/ops-model';

export function validatePropertyExists (obj: any, propertyName: string, objectType: string){ 
  const propertyValue = get(obj, propertyName);
  if (isNil(propertyValue)) {
    throw Error(`Error validating property ${propertyName} on object ${objectType}`);
  }
  return;
}

export function validateWidgetReferences (widgets: { [id: string]: Widget} , widgetReferences: string[]){ 
  for(let i = 0; i < widgetReferences.length; ++i){ 
    const found = widgets[ widgetReferences[i]];
    if(!found){ 
      throw Error(`Widget reference ${widgetReferences[i]} is not defined`);
    }
  }
}

export function validateProviderReferences (providers: { [id: string]: Provider}, providerReferences: string[]){ 
  for(let i = 0; i < providerReferences.length; ++i){ 
    const found = providers[providerReferences[i]];
    if(!found){ 
      throw Error(`Provider reference ${providerReferences[i]} is not defined`);
    }
  }
}

export function validateConsole (console: ConsoleType): void{ 
  validatePropertyExists(console, 'name', 'Console');
  validatePropertyExists(console, 'providers', 'Console');
  validatePropertyExists(console, 'pages', 'Console');
  validatePropertyExists(console, 'widgets', 'Console');
  validatePropertyExists(console, 'dependencies', 'Console');

  const allWidgetIds: string[] = [];
  const allProviders: string[] = [];
  Object.keys(console.pages).forEach((id) => { 
    allWidgetIds.push(...console.pages[id].widgetIds);
  }); 


  Object.keys(console.widgets).forEach((id) => { 
    allProviders.push(...(console.widgets[id].providerIds || []));
  });


  validateWidgetReferences(console.widgets, allWidgetIds);
  validateProviderReferences(console.providers, allProviders);

}