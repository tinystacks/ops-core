import { Widget as WidgetType } from '@tinystacks/ops-model';
import { Widget as WidgetModel } from 'ops-core/models/widget.js';

export interface Widget extends WidgetModel {
  render (
    children?: (WidgetType & { renderedElement: JSX.Element })[],
    overridesCallback?: (overrides: any) => void
  ): JSX.Element;
}