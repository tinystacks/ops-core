import { Widget as WidgetType } from '@tinystacks/ops-model';
import { BaseWidget as BaseWidgetModel } from '../models/base-widget.js';
import { TinyStacksError } from '../tinystacks-error.js';
import { Widget } from './widget.js';

export class BaseWidget extends BaseWidgetModel implements Widget {
  render (_children?: (WidgetType & { renderedElement: JSX.Element; })[], _overridesCallback?: (overrides: any) => void): JSX.Element {
    throw TinyStacksError.fromJson({
      message: 'Method not implemented.',
      status: 400
    });
  }

  static fromJson (props: WidgetType): BaseWidget {
    return new BaseWidget(props);
  }
}