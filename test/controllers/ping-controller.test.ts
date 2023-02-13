import PingController from '../../src/controllers/ping-controller';

describe('ping controller tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getPing', async () => {
    const result = await PingController.getPing();
    expect(result).toEqual('pong');
  });
});