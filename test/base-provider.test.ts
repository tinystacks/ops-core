import { BaseProvider } from '../src/base-provider.js';
import { BasicProvider } from '../src/basic-provider.js';
import TinyStacksError from '../src/tinystacks-error.js';

const fullBasicProviderDef: any = {
  id: 'MockProvider',
  type: 'BasicProvider'
};

describe('BaseProvider', () => {
  it('constructor is lossless', () => {
    const provider = new BasicProvider(fullBasicProviderDef);
    expect(provider.toJson()).toStrictEqual(fullBasicProviderDef);
  });

  it('fromJson is lossless', async () => {
    const provider = new BasicProvider(fullBasicProviderDef);
    expect(provider.toJson()).toStrictEqual(fullBasicProviderDef);
  });

  it('BaseProvider fromJson is lossless', async () => {
    const provider = await BaseProvider.fromJson(fullBasicProviderDef, require.resolve('../src/basic-provider'));
    expect(provider.toJson()).toStrictEqual(fullBasicProviderDef);
  });

  it ('throw when type is not present',  async () => {
    const providerJson = { ...fullBasicProviderDef };
    delete providerJson.type;
    const error = TinyStacksError.fromJson({
      message: `Property 'type' is missing on object type 'Provider' object ${JSON.stringify(providerJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      await BaseProvider.fromJson(providerJson, require.resolve('../src/basic-provider'));
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });
});