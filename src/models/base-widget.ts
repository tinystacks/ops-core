import { Widget } from '@tinystacks/ops-model';
import { Json } from '../types.js';
import { WidgetModel } from './widget.js';

export class BaseWidget extends WidgetModel {
  constructor (props: Widget & Json) {
    super(props);
  }

  static fromJson (props: Widget): BaseWidget {
    return new BaseWidget(props);
  }
}