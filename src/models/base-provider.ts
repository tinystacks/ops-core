import { Provider as ProviderType } from '@tinystacks/ops-model';
import { Provider } from '../core/provider.js';

export class BaseProvider extends Provider {
  static fromJson (props: ProviderType): BaseProvider {
    return new BaseProvider(props);
  }
}