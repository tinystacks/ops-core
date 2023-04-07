import { Provider } from '@tinystacks/ops-model';
import { BaseProvider } from './base-provider.js';

export class BasicProvider extends BaseProvider {
  static fromJson (props: Provider): BasicProvider {
    return new BasicProvider(props);
  }
}