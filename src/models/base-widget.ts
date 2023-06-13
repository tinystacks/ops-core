import { Widget as WidgetType } from '@tinystacks/ops-model';
import { Widget } from './widget.js';

export class BaseWidget extends Widget {
  constructor (props: WidgetType) {
    super(props);
  }

  static fromJson (props: WidgetType): BaseWidget {
    return new BaseWidget(props);
  }
}