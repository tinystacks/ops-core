import { Provider as ProviderType } from '@tinystacks/ops-model';

export abstract class Provider implements ProviderType {
  id?: string;
  type: string;

  constructor (id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}