import { BaseWidget as BaseWidgetModel } from 'ops-core/models/base-widget.js';
import { Provider } from '../models/provider.js';
import { TinyStacksError } from '../tinystacks-error.js';
import { WidgetController } from './widget.js';

export class BaseWidget extends BaseWidgetModel implements WidgetController {
  getData (_providers?: Provider[], _overrides?: any): void | Promise<void> {
    throw TinyStacksError.fromJson({
      message: 'Method not implemented.',
      status: 400
    });
  }
}