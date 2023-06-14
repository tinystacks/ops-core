const mockValidateConsole = jest.fn();
const mockDashboardParserFromJson = jest.fn();
const mockBaseProviderFromJson = jest.fn();
const mockBaseWidgetFromJson = jest.fn();
const mockBaseWidget = jest.fn();
const mockBaseWidgetToJson = jest.fn();
const mockFromJson = jest.fn();
const mockToJson = jest.fn();
const mockToYaml = jest.fn();

jest.mock('../src/parser-utils.js', () => ({
  validateConsole: mockValidateConsole
}));
jest.mock('../src/core/dashboard.js', () => ({
  Dashboard: {
    fromJson: mockDashboardParserFromJson
  }
}));
jest.mock('../src/core/provider.js', () => ({
  Provider: {
    fromJson: mockBaseProviderFromJson
  }
}));
jest.mock('../src/models/widget.js', () => ({
  Widget: {
    fromJson: mockBaseWidgetFromJson
  }
}));
jest.mock('../src/models/base-widget.js', () => ({
  BaseWidget: mockBaseWidget
}));

const mockBaseWidgetInstance = {
  toJson: mockBaseWidgetToJson
};

const mockParseable = {
  fromJson: mockFromJson,
  toJson: mockToJson
};


import { Dashboard as DashboardType, Provider as ProviderType, Widget as WidgetType, YamlDashboard, YamlWidget } from '@tinystacks/ops-model';
import { Widget } from '../src/models/widget';
import { Provider } from '../src/core/provider';
import { Console } from '../src/core/console';
import { Dashboard } from '../src/core/dashboard';

const mockBaseProvider = { ...mockParseable } as unknown as Provider;
const mockProvider: ProviderType = { id: 'mock-provider', type: 'MockProvider' };
const mockDashboardParser = { ...mockParseable, toYaml: mockToYaml } as unknown as Dashboard;
const mockDashboard: DashboardType = { id: 'mock-dashboard', route: '/mock-provider' };
const mockBaseWidgetJson = { ...mockParseable } as unknown as Widget;
const mockWidget: WidgetType = { id: 'mock-widget', type: 'MockWidget', displayName: 'Mock WidgetType' };

describe('Console tests', () => {
  beforeEach(() => {
    mockBaseWidget.mockReturnValue(mockBaseWidgetInstance);
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  it('constructor accepts properties and assigns them', () => {
    const consoleParser = new Console(
      'test-parser',
      {
        'mock-provider': mockBaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidgetJson
      }
    );

    expect(consoleParser).toHaveProperty('name', 'test-parser');
    expect(consoleParser).toHaveProperty('providers', { 'mock-provider': mockBaseProvider });
    expect(consoleParser).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboardParser });
    expect(consoleParser).toHaveProperty('widgets', { 'mock-widget': mockBaseWidgetJson });
  });
  it('parse', () => {
    jest.spyOn(Console, 'parseDashboard').mockReturnValue(mockDashboard);
    jest.spyOn(Console, 'parseProvider').mockReturnValue(mockProvider);
    jest.spyOn(Console, 'parseWidget').mockReturnValue(mockWidget);
    const console = Console.parse({
      name: 'test-console',
      dashboards: {
        'mock-dashboard': mockDashboard
      },
      providers: {
        'mock-provider': mockProvider
      },
      widgets: {
        'mock-widget': mockWidget
      }
    });

    expect(console).toHaveProperty('name', 'test-console');
    expect(console).toHaveProperty('providers', { 'mock-provider': mockProvider });
    expect(console).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
    expect(console).toHaveProperty('widgets', { 'mock-widget': mockWidget });
  });
  it('fromJson', async () => {
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    mockBaseProviderFromJson.mockReturnValue(mockProvider);
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);
    const console = await Console.fromJson({
      name: 'test-console',
      dashboards: {
        'mock-dashboard': mockDashboard
      },
      providers: {
        'mock-provider': mockProvider
      },
      widgets: {
        'mock-widget': mockWidget
      },
      dependencies: {
        MockProvider: 'mock-plugin'
      }
    });

    expect(console).toHaveProperty('name', 'test-console');
    expect(console).toHaveProperty('providers', { 'mock-provider': mockProvider });
    expect(console).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
    expect(console).toHaveProperty('widgets', { 'mock-widget': mockWidget });
  });
  it('toJson', async () => {
    mockToJson.mockReturnValueOnce(mockDashboard);
    mockToJson.mockReturnValueOnce(mockProvider);
    jest.spyOn(Console.prototype, 'widgetToJson').mockReturnValueOnce(mockWidget);
    const console = new Console(
      'test-console',
      {
        'mock-provider': mockBaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidgetJson
      },
      {
        MockProvider: 'mock-plugin'
      }
    );

    const consoleJson = console.toJson();

    expect(consoleJson).toHaveProperty('name', 'test-console');
    expect(consoleJson).toHaveProperty('providers', { 'mock-provider': mockProvider });
    expect(consoleJson).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
    expect(consoleJson).toHaveProperty('widgets', { 'mock-widget': mockWidget });
  });
  it('deepParse', async () => {
    jest.spyOn(Console, 'parseDashboard').mockReturnValue(mockDashboard);
    jest.spyOn(Console, 'parseProvider').mockReturnValue(mockProvider);
    jest.spyOn(Console, 'parseWidget').mockReturnValue(mockWidget);
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    mockBaseProviderFromJson.mockReturnValue(mockProvider);
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);

    const consoleParser = new Console(
      'test-parser',
      {
        'mock-provider': mockBaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidgetJson
      }
    );

    const console = await consoleParser.deepParse({
      name: 'test-console',
      dashboards: {
        'mock-dashboard': mockDashboard
      },
      providers: {
        'mock-provider': mockProvider
      },
      widgets: {
        'mock-widget': mockWidget
      },
      dependencies: {
        MockProvider: 'mock-plugin'
      }
    });

    expect(console).toHaveProperty('name', 'test-console');
    expect(console).toHaveProperty('providers', { 'mock-provider': mockProvider });
    expect(console).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
    expect(console).toHaveProperty('widgets', { 'mock-widget': mockWidget });
  });
  it('addDashboard', () => {
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    const console = new Console(
      'test-parser',
      {},
      {},
      {}
    );

    console.addDashboard(mockDashboard, 'mock-dashboard-1');

    expect(console).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
  });
  it('updateDashboard', () => {
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    const console = new Console(
      'test-parser',
      {},
      {
        'mock-dashboard': {} as unknown as Dashboard
      },
      {}
    );

    console.updateDashboard({ route: '/mock-dashboard' } as DashboardType, 'mock-dashboard');

    expect(console).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
  });
  it('deleteDashboard', () => {
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    const console = new Console(
      'test-parser',
      {},
      {
        'mock-dashboard': mockDashboardParser
      },
      {}
    );

    console.deleteDashboard('mock-dashboard');

    expect(console).toHaveProperty('dashboards', {});
  });
  it('addWidget', async () => {
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);

    const console = new Console(
      'test-parser',
      {},
      {},
      {},
      {
        MockWidget: 'mock-plugin'
      }
    );

    await console.addWidget(mockWidget, 'mock-widget-1');

    expect(console).toHaveProperty('widgets', { 'mock-widget': mockWidget });
  });
  it('updateWidget', async () => {
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);

    const console = new Console(
      'test-parser',
      {},
      {},
      {
        'mock-widget-1': mockBaseWidgetJson
      },
      {
        MockWidget: 'mock-plugin'
      }
    );

    await console.updateWidget({ ...mockWidget, id: undefined } as unknown as WidgetType, 'mock-widget-1');

    expect(console).toHaveProperty('widgets', { 'mock-widget-1': mockWidget });
  });
  it('deleteWidget', async () => {
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);

    const console = new Console(
      'test-parser',
      {},
      {},
      {
        'mock-widget': mockBaseWidgetJson
      },
      {
        MockWidget: 'mock-plugin'
      }
    );

    await console.deleteWidget('mock-widget');

    expect(console).toHaveProperty('widgets', {});
  });
  it('toYaml', () => {
    const mockYamlWidget = { ...mockWidget, providers: [] as any[], children: [] as any[] };
    mockToYaml.mockReturnValueOnce(mockDashboard);
    jest.spyOn(Console.prototype, 'widgetToYaml').mockReturnValueOnce(mockYamlWidget);

    const console = new Console(
      'test-console',
      {
        'mock-provider': mockProvider as unknown as Provider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidgetJson
      },
      {
        MockWidget: 'mock-plugin'
      }
    );

    const consoleYaml = console.toYaml();

    expect(consoleYaml).toHaveProperty('name', 'test-console');
    expect(consoleYaml).toHaveProperty('providers', { 'mock-provider': mockProvider });
    expect(consoleYaml).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
    expect(consoleYaml).toHaveProperty('widgets', { 'mock-widget': mockYamlWidget });
    expect(consoleYaml).toHaveProperty('dependencies', {  MockWidget: 'mock-plugin' });
  });
  it('parseDashboard', () => {
    const widgetRef = {
      '$ref': '#/Console/widgets/Md1'
    } as unknown as YamlWidget;
    const yamlDashboard: YamlDashboard = {
      route: 'mock-dashboard',
      widgets: [
        widgetRef
      ]
    };

    const parsedDashboard = Console.parseDashboard(yamlDashboard);
    expect(parsedDashboard).toEqual({
      route: 'mock-dashboard',
      widgetIds: [
        'Md1'
      ]
    });
  });
  it('parseProvider', () => {
    const yamlProvider = {
      any: 'prop',
      id: 'my-id-1'
    };

    const parsedProvider = Console.parseProvider(yamlProvider, 'my-id');

    expect(parsedProvider).toEqual({
      any: 'prop',
      id: 'my-id'
    });
  });
  it('parseWidget', () => {
    const yamlWidget = {
      id: 'mock-widget-1',
      otherProp: 'value',
      providers: [
        {
          '$ref': '#/Console/providers/MyProvider'
        }
      ],
      children: [
        {
          '$ref': '#/Console/widgets/Md1'
        }
      ]
    } as unknown as YamlWidget;

    const parsedWidget = Console.parseWidget(yamlWidget, 'mock-widget');

    expect(parsedWidget).toEqual({
      id: 'mock-widget',
      otherProp: 'value',
      providers: [
        {
          '$ref': '#/Console/providers/MyProvider'
        }
      ],
      children: [
        {
          '$ref': '#/Console/widgets/Md1'
        }
      ],
      providerIds: ['MyProvider'],
      childrenIds: ['Md1']
    });
  });
  it('widgetToJson', () => {
    const consoleParser = new Console(
      'test-parser',
      {},
      {},
      {}
    );

    const mockWidgetJson = {
      displayName: 'Mock WidgetType',
      description: 'a mock widget',
      otherProp: 'other value'
    };
    const testWidget = {
      toJson: () => mockWidgetJson
    } as unknown as Widget;

    const mockBaseWidgetJson = {
      id: 'mock-base-widget',
      type: 'MockBaseWidget',
      displayName: 'Mock Base WidgetType',
      description: 'a mock base widget'
    };
    mockBaseWidgetToJson.mockReturnValue(mockBaseWidgetJson);

    const jsonWidget = consoleParser.widgetToJson(testWidget);

    expect(jsonWidget).toEqual({
      id: 'mock-base-widget',
      type: 'MockBaseWidget',
      displayName: 'Mock Base WidgetType',
      description: 'a mock base widget',
      otherProp: 'other value'
    });
  });
  it('widgetToYaml', () => {
    const consoleParser = new Console(
      'test-parser',
      {},
      {},
      {}
    );

    const mockWidgetJson = {
      displayName: 'Mock WidgetType',
      description: 'a mock widget',
      otherProp: 'other value'
    };
    const testWidget = {
      toJson: () => mockWidgetJson
    } as unknown as Widget;

    const mockBaseWidgetJson = {
      id: 'mock-base-widget',
      type: 'MockBaseWidget',
      displayName: 'Mock Base WidgetType',
      description: 'a mock base widget',
      providerIds: ['MockProvider'],
      childrenIds: ['MockChildWidget']
    };
    mockBaseWidgetToJson.mockReturnValue(mockBaseWidgetJson);

    const jsonWidget = consoleParser.widgetToYaml(testWidget);

    expect(jsonWidget).toEqual({
      id: 'mock-base-widget',
      type: 'MockBaseWidget',
      displayName: 'Mock Base WidgetType',
      description: 'a mock base widget',
      otherProp: 'other value',
      providers: [
        {
          '$ref': '#/Console/providers/MockProvider'
        }
      ],
      children: [
        {
          '$ref': '#/Console/widgets/MockChildWidget'
        }
      ]
    });
  });
});