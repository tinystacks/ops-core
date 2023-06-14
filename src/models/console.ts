import { validateConsole } from '../parser-utils.js';
import {
  Console as ConsoleType,
  Dashboard as DashboardType,
  Provider as ProviderType,
  Widget as WidgetType,
  YamlConsole,
  YamlWidget,
  YamlProvider,
  YamlDashboard,
  Constant
} from '@tinystacks/ops-model';
import { Dashboard } from './dashboard.js';
import { Provider } from './provider.js';
import { Widget } from './widget.js';
import { BaseWidget } from './base-widget.js';
import { Json } from '../types.js';
import { Parsable } from './parsable.js';

type ExportRefs = { [ref: string]: string }[];
type ExportYamlWidget = Omit<YamlWidget, 'providers' | 'children'> & {
  providers: ExportRefs,
  children: ExportRefs
}

type ExportConsoleYaml = Omit<YamlConsole, 'widgets'> & {
  widgets: { [id: string]: ExportYamlWidget }
}

export class Console extends Parsable implements ConsoleType {
  name: string;
  repository?: { url?: string; branch?: string; configFile?: string };
  providers: Record<string, Provider>;
  dashboards: Record<string, Dashboard>;
  widgets: Record<string, Widget>;
  dependencies?: Record<string, string>;
  constants?: Record<string, Constant>;
  fromJson: (object: ConsoleType, dependencySource: string) => Console | Promise<Console>;

  constructor (
    name: string,
    providers: Record<string, Provider>,
    dashboards: Record<string, Dashboard>,
    widgets: Record<string, Widget>,
    dependencies?: ConsoleType['dependencies'],
    constants: Record<string, Constant> = {},
    repository?: { url?: string; branch?: string; configFile?: string }
  ) {
    super();
    this.name = name;
    this.providers = providers;
    this.dashboards = dashboards;
    this.widgets = widgets;
    this.dependencies = dependencies;
    this.constants = constants;
    this.repository = repository;
    this.fromJson = Console.fromJson;
  }

  static parse (consoleYaml: YamlConsole): ConsoleType {
    const {
      name,
      providers,
      dashboards,
      widgets,
      dependencies,
      constants = {},
      repository
    } = consoleYaml;

    const dashboardObjects : Record<string, DashboardType> = {};
    Object.keys(dashboards).forEach((id) => {
      dashboardObjects[id] = Console.parseDashboard(dashboards[id], id);
    });

    const providerObjects: Record<string, ProviderType> = {};
    Object.keys(providers).forEach((id) => {
      providerObjects[id] = this.parseProvider(providers[id], id);
    });

    const widgetObjects: Record<string, WidgetType> = {};
    Object.keys(widgets).forEach((id) => {
      widgetObjects[id] = this.parseWidget(widgets[id], id);
    });

    return {
      name,
      providers: providerObjects,
      dashboards: dashboardObjects,
      widgets: widgetObjects,
      dependencies,
      constants,
      repository
    };
  }

  static async fromJson (object: ConsoleType): Promise<Console> {
    const {
      name,
      dashboards,
      providers,
      widgets,
      dependencies,
      constants = {},
      repository
    } = object;

    validateConsole(object);

    const dashboardObjects = Object.entries(dashboards).reduce<{ [id: string]: Dashboard }>((acc, [id, dashboard]) => {
      acc[id] = Dashboard.fromJson(dashboard);
      return acc;
    }, {});

    const resolvedProviders: { [id: string]: Provider } = {};
    for (const [id, provider] of Object.entries(providers)) {
      resolvedProviders[id] = await Provider.fromJson(provider, dependencies[providers[id].type]);
    }

    const resolvedWidgets: { [id: string]: Widget } = {};
    for (const [id, widget] of Object.entries(widgets)) {
      resolvedWidgets[id] = await Widget.fromJson(widget, dependencies[widgets[id].type]);
    }

    return new Console(
      name,
      resolvedProviders,
      dashboardObjects,
      resolvedWidgets,
      dependencies,
      constants,
      repository
    );
  }

  toJson (): ConsoleType {
    const dashboards = Object.entries(this.dashboards).reduce<{ [id: string]: DashboardType }>((acc, [id, dashboard]) => {
      acc[id] = dashboard.toJson();
      return acc;
    }, {});

    const providers = Object.entries(this.providers).reduce<{ [id: string]: ProviderType }>((acc, [id, provider]) => {
      acc[id] = provider.toJson();
      return acc;
    }, {});

    const widgets = Object.entries(this.widgets).reduce<{ [id: string]: WidgetType }>((acc, [id, widget]) => {
      acc[id] = this.widgetToJson(widget);
      return acc;
    }, {});
    return {
      name: this.name,
      dashboards,
      providers,
      widgets,
      dependencies: this.dependencies,
      constants: this.constants,
      repository: this.repository
    };
  }

  async deepParse (consoleYaml: YamlConsole): Promise<Console> {
    const parsedYaml: ConsoleType = Console.parse(consoleYaml);
    return await Console.fromJson(parsedYaml);
  }

  addDashboard (dashboard: DashboardType, id: string): void {
    this.dashboards = this.dashboards || {};
    this.dashboards[dashboard.id || id] = Dashboard.fromJson(dashboard);
  }

  updateDashboard (dashboard: DashboardType, id:string): void {
    this.dashboards = this.dashboards || {};
    this.dashboards[dashboard.id || id] = Dashboard.fromJson(dashboard);
  }

  deleteDashboard (id: string): void {
    this.dashboards = this.dashboards || {};
    delete this.dashboards[id];
  }

  async addWidget (widget: WidgetType, id: string) {
    this.widgets = this.widgets || {};
    const dependencySource = this.dependencies[widget.type];
    this.widgets[widget.id || id] = await Widget.fromJson(widget, dependencySource);
  }

  async updateWidget (widget: WidgetType, id: string) {
    this.widgets = this.widgets || {};
    const dependencySource = this.dependencies[widget.type];
    this.widgets[widget.id || id] = await Widget.fromJson(widget, dependencySource);
  }

  deleteWidget (id: string): void {
    this.widgets = this.widgets || {};
    delete this.widgets[id];
  }

  toYaml (): ExportConsoleYaml {
    const dashboardObjects: { [id: string]: DashboardType } = {};
    for (const [id, dashboard] of Object.entries(this.dashboards)) {
      dashboardObjects[id] = dashboard.toYaml();
    }

    const providerObjects: { [id: string]: YamlProvider } = {};
    for (const [id, provider] of Object.entries(this.providers)) {
      providerObjects[id] = provider;
    }

    const widgetObjects: { [id: string]: ExportYamlWidget } = {};
    for (const [id, widget] of Object.entries(this.widgets)) {
      widgetObjects[id] = this.widgetToYaml(widget);
    }

    return {
      name: this.name,
      dashboards: dashboardObjects,
      providers: providerObjects,
      widgets: widgetObjects,
      dependencies: this.dependencies,
      constants: this.constants,
      repository: this.repository
    };
  }

  static parseDashboard (yamlDashboard: YamlDashboard, id?: string): DashboardType {

    const {
      route,
      widgets,
      parameters,
      description
    } = yamlDashboard;

    const widgetIds = widgets.map((item) => {
      const [_, __, ___, widgetId ] = item.$ref.split('/');
      return widgetId;
    });


    return {
      route,
      widgetIds,
      parameters,
      description,
      id
    };
  }

  static parseProvider (yamlProvider: any, id: string): ProviderType {
    //need to figure out credentials
    return {
      ...yamlProvider,
      id
    };
  }

  static parseWidget (yamlWidget: YamlWidget, id: string): WidgetType {
    // TODO: Multifile
    const providerIds = (yamlWidget.providers || []).map((provider: any) => provider.$ref.split('/')[3]);
    // TODO: Multifile
    const childrenIds = (yamlWidget.children || []).map((child: any) => child.$ref.split('/')[3]);
    return { ...yamlWidget, providerIds, childrenIds, id };
  }

  widgetToJson<T extends Widget> (widget: T): WidgetType & Json {
    const widgetJson = widget.toJson();
    /**
     * We can't call super on a class instance,
     * so we use a wrapper class to access toJson from the abstract class
     * in case the implementer doesn't call it from within their own toJson implementation.
     */
    const baseWidget = new BaseWidget(widget);
    const baseWidgetJson = baseWidget.toJson();
    return {
      ...widgetJson,
      // Always overwrite base propeties with the response from Widget.toJson
      ...baseWidgetJson
    };
  }

  widgetToYaml<T extends Widget> (widget: T): ExportYamlWidget {
    const widgetJson = this.widgetToJson(widget);
    // TODO: Multifile
    const providers = widgetJson.providerIds.map(providerId => ({ $ref: `#/Console/providers/${providerId}` }));
    // TODO: Multifile
    const children = widgetJson.childrenIds.map(childId => ({ $ref: `#/Console/widgets/${childId}` }));
    delete widgetJson.providerIds;
    delete widgetJson.childrenIds;
    return {
      ...widgetJson,
      providers,
      children
    };
  }

}