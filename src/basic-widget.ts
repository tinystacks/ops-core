import { Widget } from '@tinystacks/ops-model';
import { BaseProvider } from './base-provider.js';
import { BaseWidget } from './base-widget.js';
import { OtherProperties } from './types.js';

export class BasicWidget extends BaseWidget {
  constructor (props: Widget & OtherProperties) {
    super(props);
  }

  static fromJson (props: Widget): BasicWidget {
    return new BasicWidget(props);
  }

  getData (_providers?: BaseProvider[], _overrides?: any): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
  render (_children?: (Widget & { renderedElement: JSX.Element; })[], _overridesCallback?: (overrides: any) => void): JSX.Element {
    throw new Error('Method not implemented.');
  }
}