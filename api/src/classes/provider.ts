import { Provider as ProviderType } from '@tinystacks/ops-model';

abstract class Provider implements ProviderType {
  id: string;

  constructor (id: string) {
    this.id = id;
  }
}

export default Provider;