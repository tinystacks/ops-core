import { validateConsole } from './parser-utils.js';
import {
  Console, Dashboard, Provider, Widget, YamlConsole, YamlWidget, YamlProvider
} from '@tinystacks/ops-model';
import { DashboardParser } from './dashboard-parser.js';
import { BaseProvider } from './base-provider.js';
import { BaseWidget } from './base-widget.js';
import BasicWidget from './basic-widget.js';
import { OtherProperties } from './types.js';

type ExportRefs = { [ref: string]: string }[];
type ExportYamlWidget = Omit<YamlWidget, 'providers' | 'children'> & {
  providers: ExportRefs,
  children: ExportRefs
}

type ExportConsoleYaml = Omit<YamlConsole, 'widgets'> & {
  widgets: { [id: string]: ExportYamlWidget }
}

export class ConsoleParser implements Console {
  name: string;
  providers: Record<string, BaseProvider>;
  dashboards: Record<string, DashboardParser>;
  widgets: Record<string, BaseWidget>;
  dependencies?: Record<string, string>;

  constructor (
    name: string,
    providers: Record<string, BaseProvider>,
    dashboards: Record<string, DashboardParser>,
    widgets: Record<string, BaseWidget>, 
    dependencies?: Console['dependencies']
  ) {
    this.name = name;
    this.providers = providers;
    this.dashboards = dashboards;
    this.widgets = widgets;
    this.dependencies = dependencies;
  }

  static parse (consoleYaml: YamlConsole): Console { 
    const { 
      name,
      providers, 
      dashboards,
      widgets, 
      dependencies
    } = consoleYaml;

    const dashboardObjects : Record<string, Dashboard> = {}; 
    Object.keys(dashboards).forEach((id) => { 
      dashboardObjects[id] = DashboardParser.parse(dashboards[id], id);
    });

    const providerObjects: Record<string, Provider> = {}; 
    Object.keys(providers).forEach((id) => { 
      providerObjects[id] = this.parseProvider(providers[id], id);
    });

    const widgetObjects: Record<string, Widget> = {}; 
    Object.keys(widgets).forEach((id) => {
      widgetObjects[id] = this.parseWidget(widgets[id], id);
    });

    return {
      name, 
      providers: providerObjects,
      dashboards: dashboardObjects,
      widgets: widgetObjects, 
      dependencies
    };
  }

  static async fromJson (object: Console): Promise<ConsoleParser> {
    const {
      name,
      dashboards,
      providers,
      widgets, 
      dependencies
    } = object;
    
    validateConsole(object);

    const dashboardObjects = Object.entries(dashboards).reduce<{ [id: string]: DashboardParser }>((acc, [id, dashboard]) => {
      acc[id] = DashboardParser.fromJson(dashboard);
      return acc;
    }, {});
    
    const resolvedProviders: { [id: string]: BaseProvider } = {}; 
    for (const [id, provider] of Object.entries(providers)) {
      resolvedProviders[id] = await BaseProvider.fromJson(provider, dependencies[providers[id].type]);
    }
    
    const resolvedWidgets: { [id: string]: BaseWidget } = {};
    for (const [id, widget] of Object.entries(widgets)) {
      resolvedWidgets[id] = await BaseWidget.fromJson(widget, dependencies[widgets[id].type]);
    }

    return new ConsoleParser(
      name,
      resolvedProviders,
      dashboardObjects,
      resolvedWidgets, 
      dependencies
    );
  }

  toJson (): Console { 
    const dashboards = Object.entries(this.dashboards).reduce<{ [id: string]: Dashboard }>((acc, [id, dashboard]) => {
      acc[id] = dashboard.toJson();
      return acc;
    }, {});
    
    const providers = Object.entries(this.providers).reduce<{ [id: string]: Provider }>((acc, [id, provider]) => {
      acc[id] = provider.toJson();
      return acc;
    }, {});
    
    const widgets = Object.entries(this.widgets).reduce<{ [id: string]: Widget }>((acc, [id, widget]) => {
      acc[id] = this.widgetToJson(widget);
      return acc;
    }, {});
    return {
      name: this.name,
      dashboards,
      providers,
      widgets,
      dependencies: this.dependencies
    };
  }

  async deepParse (consoleYaml: YamlConsole): Promise<ConsoleParser> {
    const parsedYaml: Console = ConsoleParser.parse(consoleYaml);
    return await ConsoleParser.fromJson(parsedYaml);
  }

  addDashboard (dashboard: Dashboard, id: string): void {
    this.dashboards = this.dashboards || {};
    this.dashboards[dashboard.id || id] = DashboardParser.fromJson(dashboard);
  }

  updateDashboard (dashboard: Dashboard, id:string): void {
    this.dashboards = this.dashboards || {};
    this.dashboards[dashboard.id || id] = DashboardParser.fromJson(dashboard);
  }
  
  deleteDashboard (id: string): void {
    this.dashboards = this.dashboards || {};
    delete this.dashboards[id];
  }
  
  async addWidget (widget: Widget, id: string) {
    this.widgets = this.widgets || {};
    const dependencySource = this.dependencies[widget.type];
    this.widgets[widget.id || id] = await BaseWidget.fromJson(widget, dependencySource);
  }
 
  async updateWidget (widget: Widget, id: string) {
    this.widgets = this.widgets || {};
    const dependencySource = this.dependencies[widget.type];
    this.widgets[widget.id || id] = await BaseWidget.fromJson(widget, dependencySource);
  }
  
  deleteWidget (id: string): void {
    this.widgets = this.widgets || {};
    delete this.widgets[id];
  }

  toYaml (): ExportConsoleYaml {
    const dashboardObjects: { [id: string]: Dashboard } = {};
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
      dependencies: this.dependencies
    };
  }

  static parseProvider (yamlProvider: any, id: string): Provider { 
    //need to figure out credentials
    return {
      ...yamlProvider,
      id
    };
  }

  static parseWidget (yamlWidget: YamlWidget, id: string): Widget {
    // TODO: Multifile
    const providerIds = (yamlWidget.providers || []).map((provider: any) => provider.$ref.split('/')[3]);
    // TODO: Multifile
    const childrenIds = (yamlWidget.children || []).map((child: any) => child.$ref.split('/')[3]);
    return { ...yamlWidget, providerIds, childrenIds, id };
  }

  widgetToJson<T extends BaseWidget> (widget: T): Widget & OtherProperties {
    const widgetJson = widget.toJson();
    /** 
     * We can't call super on a class instance, 
     * so we use a wrapper class to access toJson from the abstract class
     * in case the implementer doesn't call it from within their own toJson implementation.
     */ 
    const basicWidget = new BasicWidget(widget);
    const baseWidgetJson = basicWidget.toJson();
    return {
      ...widgetJson,
      // Always overwrite base propeties with the response from BaseWidget.toJson
      ...baseWidgetJson
    };
  }

  widgetToYaml<T extends BaseWidget> (widget: T): ExportYamlWidget {
    const widgetJson = this.widgetToJson(widget);
    // TODO: Multifile
    const providers = widget.providerIds.map(providerId => ({ $ref: `#/Console/providers/${providerId}` }));
    // TODO: Multifile
    const children = widget.childrenIds.map(childId => ({ $ref: `#/Console/widgets/${childId}` }));
    delete widgetJson.providerIds;
    delete widgetJson.childrenIds;
    return {
      providers,
      children
    };
  }

}