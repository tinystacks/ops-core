import { Widget } from '@tinystacks/ops-model';
import { WidgetModel } from 'ops-core/models/widget.js';

export interface WidgetView extends WidgetModel {
  render (
    children?: (Widget & { renderedElement: JSX.Element })[],
    overridesCallback?: (overrides: any) => void
  ): JSX.Element;
}