import {
  AwsProfileProvider,
  Console,
  Page,
  Provider,
  Widget
} from '@tinystacks/ops-model';

type Json = {
  [key: string]: any
};

type GenericWidgetType = Widget & Json;

type YamlWidget = {
  [WidgetName: string]: GenericWidgetType;
}

type YamlPageProperties = Omit<Page, 'widgets'> & {
  widgets: YamlWidget[];
}
type YamlPage = {
  Page: YamlPageProperties;
}

type YamlProvider = {
  [ProviderName: string]: Provider | AwsProfileProvider;
}
type YamlConsoleProperties = Omit<Console, 'providers' | 'pages' | 'widgets'> & {
  providers: YamlProvider[];
  pages: YamlPage[];
  widgets: YamlWidget[];
}
type YamlConsole = {
  Console: YamlConsoleProperties;
}

export {
  Json,
  GenericWidgetType,
  YamlWidget,
  YamlPage,
  YamlProvider,
  YamlConsole
};