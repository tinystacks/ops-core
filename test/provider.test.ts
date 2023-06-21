import { Provider } from '../src/core/provider.js';
import { BaseProvider } from '../src/models/base-provider.js';
import TinyStacksError from '../src/tinystacks-error.js';

const fullBaseProviderDef: any = {
  id: 'MockProvider',
  type: 'BaseProvider'
};

describe('Provider', () => {
  it('constructor is lossless', () => {
    const provider = new BaseProvider(fullBaseProviderDef);
    expect(provider.toJson()).toStrictEqual(fullBaseProviderDef);
  });

  it('fromJson is lossless', async () => {
    const provider = new BaseProvider(fullBaseProviderDef);
    expect(provider.toJson()).toStrictEqual(fullBaseProviderDef);
  });

  it('Provider fromJson is lossless', async () => {
    const provider = await Provider.fromJson(fullBaseProviderDef, require.resolve('../src/models/base-provider'));
    expect(provider.toJson()).toStrictEqual(fullBaseProviderDef);
  });

  it ('throw when type is not present',  async () => {
    const providerJson = { ...fullBaseProviderDef };
    delete providerJson.type;
    const error = TinyStacksError.fromJson({
      message: `Property 'type' is missing on object type 'Provider' object ${JSON.stringify(providerJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      await Provider.fromJson(providerJson, require.resolve('../src/models/base-provider'));
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });
});