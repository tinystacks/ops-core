import { Widget } from '@tinystacks/ops-model';
import { BaseWidget as BaseWidgetModel } from '../models/base-widget.js';
import { TinyStacksError } from '../tinystacks-error.js';
import { WidgetView } from './widget.js';

export class BaseWidget extends BaseWidgetModel implements WidgetView {
  render (_children?: (Widget & { renderedElement: JSX.Element; })[], _overridesCallback?: (overrides: any) => void): JSX.Element {
    throw TinyStacksError.fromJson({
      message: 'Method not implemented.',
      status: 400
    });
  }
}