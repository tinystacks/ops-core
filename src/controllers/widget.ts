import { Provider } from '../models/provider.js';
import { Json } from '../types.js';
import { WidgetModel } from 'ops-core/models/widget.js';

export interface WidgetController extends WidgetModel {
  getData (providers?: Provider[], overrides?: any, parameters?: Json): void | Promise<void>;
}