import { Widget as WidgetType } from '@tinystacks/ops-model';
import { BaseWidget as BaseWidgetModel } from '../models/base-widget.js';
import { Provider } from '../models/provider.js';
import { TinyStacksError } from '../tinystacks-error.js';
import { Widget } from './widget.js';

export class BaseWidget extends BaseWidgetModel implements Widget {
  getData (_providers?: Provider[], _overrides?: any): void | Promise<void> {
    throw TinyStacksError.fromJson({
      message: 'Method not implemented.',
      status: 400
    });
  }

  static fromJson (props: WidgetType): BaseWidget {
    return new BaseWidget(props);
  }
}