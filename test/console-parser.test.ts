const mockValidateConsole = jest.fn();
const mockDashboardParserFromJson = jest.fn();
const mockBaseProviderFromJson = jest.fn();
const mockBaseWidgetFromJson = jest.fn();
const mockBasicWidget = jest.fn();
const mockBasicWidgetToJson = jest.fn();
const mockFromJson = jest.fn();
const mockToJson = jest.fn();
const mockToYaml = jest.fn();

jest.mock('../src/parser-utils.js', () => ({
  validateConsole: mockValidateConsole
}));
jest.mock('../src/dashboard-parser.js', () => ({
  DashboardParser: {
    fromJson: mockDashboardParserFromJson
  }
}));
jest.mock('../src/base-provider.js', () => ({
  BaseProvider: {
    fromJson: mockBaseProviderFromJson
  }
}));
jest.mock('../src/base-widget.js', () => ({
  BaseWidget: {
    fromJson: mockBaseWidgetFromJson
  }
}));
jest.mock('../src/basic-widget.js', () => ({
  BasicWidget: mockBasicWidget
}));

const mockBasicWidgetInstance = {
  toJson: mockBasicWidgetToJson
};

const mockParseable = {
  fromJson: mockFromJson,
  toJson: mockToJson
};


import { Dashboard, Provider, Widget, YamlDashboard, YamlWidget } from '@tinystacks/ops-model';
import { BaseProvider } from '../src/base-provider';
import { BaseWidget } from '../src/base-widget';
import { ConsoleParser } from '../src/console-parser';
import { DashboardParser } from '../src/dashboard-parser';

const mockBaseProvider = { ...mockParseable } as unknown as BaseProvider;
const mockProvider: Provider = { id: 'mock-provider', type: 'MockProvider' };
const mockDashboardParser = { ...mockParseable, toYaml: mockToYaml } as unknown as DashboardParser;
const mockDashboard: Dashboard = { id: 'mock-dashboard', route: '/mock-provider' };
const mockBaseWidget = { ...mockParseable } as unknown as BaseWidget;
const mockWidget: Widget = { id: 'mock-widget', type: 'MockWidget', displayName: 'Mock Widget' };

describe('ConsoleParser tests', () => {
  beforeEach(() => {
    mockBasicWidget.mockReturnValue(mockBasicWidgetInstance);
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  it('constructor accepts properties and assigns them', () => {
    const consoleParser = new ConsoleParser(
      'test-parser',
      {
        'mock-provider': mockBaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidget
      }
    );

    expect(consoleParser).toHaveProperty('name', 'test-parser');
    expect(consoleParser).toHaveProperty('providers', { 'mock-provider': mockBaseProvider });
    expect(consoleParser).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboardParser });
    expect(consoleParser).toHaveProperty('widgets', { 'mock-widget': mockBaseWidget });
  });
  it('parse', () => {
    jest.spyOn(ConsoleParser, 'parseDashboard').mockReturnValue(mockDashboard);
    jest.spyOn(ConsoleParser, 'parseProvider').mockReturnValue(mockProvider);
    jest.spyOn(ConsoleParser, 'parseWidget').mockReturnValue(mockWidget);
    const console = ConsoleParser.parse({
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
    const console = await ConsoleParser.fromJson({
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
    jest.spyOn(ConsoleParser.prototype, 'widgetToJson').mockReturnValueOnce(mockWidget);
    const console = new ConsoleParser(
      'test-console',
      {
        'mock-provider': mockBaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidget
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
    jest.spyOn(ConsoleParser, 'parseDashboard').mockReturnValue(mockDashboard);
    jest.spyOn(ConsoleParser, 'parseProvider').mockReturnValue(mockProvider);
    jest.spyOn(ConsoleParser, 'parseWidget').mockReturnValue(mockWidget);
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    mockBaseProviderFromJson.mockReturnValue(mockProvider);
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);

    const consoleParser = new ConsoleParser(
      'test-parser',
      {
        'mock-provider': mockBaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidget
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
    const console = new ConsoleParser(
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
    const console = new ConsoleParser(
      'test-parser',
      {},
      {
        'mock-dashboard': {} as unknown as DashboardParser
      },
      {}
    );

    console.updateDashboard({ route: '/mock-dashboard' } as Dashboard, 'mock-dashboard');

    expect(console).toHaveProperty('dashboards', { 'mock-dashboard': mockDashboard });
  });
  it('deleteDashboard', () => {
    mockDashboardParserFromJson.mockReturnValue(mockDashboard);
    const console = new ConsoleParser(
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

    const console = new ConsoleParser(
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

    const console = new ConsoleParser(
      'test-parser',
      {},
      {},
      {
        'mock-widget-1': mockBaseWidget
      },
      {
        MockWidget: 'mock-plugin'
      }
    );

    await console.updateWidget({ ...mockWidget, id: undefined } as unknown as Widget, 'mock-widget-1');

    expect(console).toHaveProperty('widgets', { 'mock-widget-1': mockWidget });
  });
  it('deleteWidget', async () => {
    mockBaseWidgetFromJson.mockReturnValue(mockWidget);

    const console = new ConsoleParser(
      'test-parser',
      {},
      {},
      {
        'mock-widget': mockBaseWidget
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
    jest.spyOn(ConsoleParser.prototype, 'widgetToYaml').mockReturnValueOnce(mockYamlWidget);

    const console = new ConsoleParser(
      'test-console',
      {
        'mock-provider': mockProvider as unknown as BaseProvider
      },
      {
        'mock-dashboard': mockDashboardParser
      },
      {
        'mock-widget': mockBaseWidget
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

    const parsedDashboard = ConsoleParser.parseDashboard(yamlDashboard);
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

    const parsedProvider = ConsoleParser.parseProvider(yamlProvider, 'my-id');

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

    const parsedWidget = ConsoleParser.parseWidget(yamlWidget, 'mock-widget');

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
    const consoleParser = new ConsoleParser(
      'test-parser',
      {},
      {},
      {}
    );

    const mockWidgetJson = {
      displayName: 'Mock Widget',
      description: 'a mock widget',
      otherProp: 'other value'
    };
    const testWidget = {
      toJson: () => mockWidgetJson
    } as unknown as BaseWidget;

    const mockBaseWidgetJson = {
      id: 'mock-basic-widget',
      type: 'MockBasicWidget',
      displayName: 'Mock Basic Widget',
      description: 'a mock basic widget'
    };
    mockBasicWidgetToJson.mockReturnValue(mockBaseWidgetJson);

    const jsonWidget = consoleParser.widgetToJson(testWidget);

    expect(jsonWidget).toEqual({
      id: 'mock-basic-widget',
      type: 'MockBasicWidget',
      displayName: 'Mock Basic Widget',
      description: 'a mock basic widget',
      otherProp: 'other value'
    });
  });
  it('widgetToYaml', () => {
    const consoleParser = new ConsoleParser(
      'test-parser',
      {},
      {},
      {}
    );

    const mockWidgetJson = {
      displayName: 'Mock Widget',
      description: 'a mock widget',
      otherProp: 'other value'
    };
    const testWidget = {
      toJson: () => mockWidgetJson
    } as unknown as BaseWidget;

    const mockBaseWidgetJson = {
      id: 'mock-basic-widget',
      type: 'MockBasicWidget',
      displayName: 'Mock Basic Widget',
      description: 'a mock basic widget',
      providerIds: ['MockProvider'],
      childrenIds: ['MockChildWidget']
    };
    mockBasicWidgetToJson.mockReturnValue(mockBaseWidgetJson);

    const jsonWidget = consoleParser.widgetToYaml(testWidget);

    expect(jsonWidget).toEqual({
      id: 'mock-basic-widget',
      type: 'MockBasicWidget',
      displayName: 'Mock Basic Widget',
      description: 'a mock basic widget',
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