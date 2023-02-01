import {
  AwsProfileProvider,
  Console,
  Page,
  Provider,
  Widget,
  TinyStacksError
} from '@tinystacks/ops-model';

type Json = {
  [key: string]: any
};

type GenericWidgetType = Widget & Json;

type YamlWidget = {
  [WidgetName: string]: GenericWidgetType;
}

type YamlPage = {
  Page: Page;
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

type TinyStacksErrorObject = Omit<TinyStacksError, 'type'> & {
  type: TinyStacksError.type | string
};

export {
  Json,
  GenericWidgetType,
  YamlWidget,
  YamlPage,
  YamlProvider,
  YamlConsole,
  TinyStacksErrorObject
};