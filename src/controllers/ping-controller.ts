import { Ping } from '@tinystacks/ops-model';

const PingController = {
  async getPing (): Promise<Ping> {
    return 'pong';
  }
};

export default PingController;