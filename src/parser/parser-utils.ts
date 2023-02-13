import { get, isNil } from 'lodash';
import { Ref, YamlProvider, YamlWidget } from '../types';

export function validatePropertyExists(obj: any, propertyName: string, objectType: string){ 
  const propertyValue = get(obj, propertyName);
  if (isNil(propertyValue)) {
    throw Error(`Error validating property ${propertyName} on object ${objectType}`)
  }
  return;
}

export function validateWidgetReferences(widgets: { [id: string]: YamlWidget} , widgetReferences: Ref[]){ 
  for(let i = 0; i < widgetReferences.length; ++i){ 
    const [_, __, ___, widgetId] = widgetReferences[i].$ref.split("/"); 
    const found = widgets[widgetId];
    if(!found){ 
      throw Error(`Widget reference ${widgetReferences[i].$ref} is not defined`);
    }
  }
}

export function validateProviderReferences(providers: { [id: string]: YamlProvider}, providerReferences: Ref[]){ 
  for(let i = 0; i < providerReferences.length; ++i){ 
    const [_, __, ___, providerId] = providerReferences[i].$ref.split("/"); 
    const found = providers[providerId];
    if(!found){ 
      throw Error(`Provider reference ${providerReferences[i].$ref} is not defined`);
    }
  }
}