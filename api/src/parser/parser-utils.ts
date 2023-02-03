import { get, isNil } from 'lodash';

export function validatePropertyExists(obj: any, propertyName: string, objectType: string){ 
  const propertyValue = get(obj, propertyName);
  if (isNil(propertyValue)) {
    throw Error(`Error validating property ${propertyName} on object ${objectType}`)
  }
  return;
}

