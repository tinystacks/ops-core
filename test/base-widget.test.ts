import { BaseWidget } from '../src/base-widget.js';
import { BasicWidget } from '../src/basic-widget.js';
import { TinyStacksError } from '../src/tinystacks-error.js';

const fullBasicWidgetDef: any = {
  id: 'mock-widget',
  type: 'BasicWidget',
  displayName: 'Mock Widget',
  displayOptions: {
    showDisplayName: true
  },
  providerIds: ['provider'],
  childrenIds: ['child'],
  description: 'a mock widget'
};

describe('BaseWidget Testing', () => {
  it('constructor is lossless', () => {
    const widget = new BasicWidget(fullBasicWidgetDef);
    expect(widget.toJson()).toStrictEqual(fullBasicWidgetDef);
  });

  it('fromJson is lossless', async () => {
    const widget = BasicWidget.fromJson(fullBasicWidgetDef);
    expect(widget.toJson()).toStrictEqual(fullBasicWidgetDef);
  });

  it('BaseWidget fromJson is lossless', async () => {
    const widget = await BaseWidget.fromJson(fullBasicWidgetDef, require.resolve('../src/basic-widget'));
    expect(widget.toJson()).toStrictEqual(fullBasicWidgetDef);
  });

  it ('BasicWidget throws error on getData', async () => {
    const widget = BasicWidget.fromJson(fullBasicWidgetDef);
    const error = TinyStacksError.fromJson({
      message: 'Method not implemented.',
      status: 400
    });
    let thrownError: any;
    try {
      await widget.getData();
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });

  it ('BasicWidget throws error on render', () => {
    const widget = BasicWidget.fromJson(fullBasicWidgetDef);
    const error = TinyStacksError.fromJson({
      message: 'Method not implemented.',
      status: 400
    });
    let thrownError: any;
    try {
      widget.render();
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });

  it ('throw when id is not present',  async () => {
    const widgetJson = { ...fullBasicWidgetDef };
    delete widgetJson.id;
    const error = TinyStacksError.fromJson({
      message: `Property 'id' is missing on object type 'Widget' object ${JSON.stringify(widgetJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      await BaseWidget.fromJson(widgetJson, require.resolve('../src/basic-widget'));
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });

  it ('throw when type is not present',  async () => {
    const widgetJson = { ...fullBasicWidgetDef };
    delete widgetJson.type;
    const error = TinyStacksError.fromJson({
      message: `Property 'type' is missing on object type 'Widget' object ${JSON.stringify(widgetJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      await BaseWidget.fromJson(widgetJson, require.resolve('../src/basic-widget'));
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });

  it ('throw when displayName is not present',  async () => {
    const widgetJson = { ...fullBasicWidgetDef };
    delete widgetJson.displayName;
    const error = TinyStacksError.fromJson({
      message: `Property 'displayName' is missing on object type 'Widget' object ${JSON.stringify(widgetJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      await BaseWidget.fromJson(widgetJson, require.resolve('../src/basic-widget'));
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });
});