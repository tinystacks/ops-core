import { Widget } from '../src/models/widget.js';
import { BaseWidget } from '../src/models/base-widget.js';
import { BaseWidget as BaseWidgetController } from '../src/controllers/base-widget.js';
import { BaseWidget as BaseWidgetView } from '../src/views/base-widget.js';
import { TinyStacksError } from '../src/tinystacks-error.js';

const fullBasicWidgetDef: any = {
  id: 'mock-widget',
  type: 'BaseWidget',
  displayName: 'Mock Widget',
  displayOptions: {
    showDisplayName: true
  },
  providerIds: ['provider'],
  childrenIds: ['child'],
  description: 'a mock widget'
};

describe('Widget Testing', () => {
  it('constructor is lossless', () => {
    const widget = new BaseWidget(fullBasicWidgetDef);
    expect(widget.toJson()).toStrictEqual(fullBasicWidgetDef);
  });

  it('fromJson is lossless', async () => {
    const widget = BaseWidget.fromJson(fullBasicWidgetDef);
    expect(widget.toJson()).toStrictEqual(fullBasicWidgetDef);
  });

  it('Widget fromJson is lossless', async () => {
    const widget = await Widget.fromJson(fullBasicWidgetDef, require.resolve('../src/models/base-widget'));
    expect(widget.toJson()).toStrictEqual(fullBasicWidgetDef);
  });

  it ('BaseWidget throws error on getData', async () => {
    const widget: BaseWidgetController = BaseWidgetController.fromJson(fullBasicWidgetDef);
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

  it ('BaseWidget throws error on render', () => {
    const widget: BaseWidgetView = BaseWidgetView.fromJson(fullBasicWidgetDef);
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
      await Widget.fromJson(widgetJson, require.resolve('../src/models/base-widget'));
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
      await Widget.fromJson(widgetJson, require.resolve('../src/models/base-widget'));
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
      await Widget.fromJson(widgetJson, require.resolve('../src/models/base-widget'));
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });
});