import { Provider } from '../core/provider.js';
import { Json } from '../types.js';
import { Widget as WidgetModel } from '../models/widget.js';

export interface Widget extends WidgetModel {
  getData (providers?: Provider[], overrides?: any, parameters?: Json): void | Promise<void>;
}