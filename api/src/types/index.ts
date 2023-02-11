import {
  AwsProfileProvider,
  Console,
  Page,
  Provider,
  Widget,
  TinyStacksError,
  Tab,
  TabPanel
} from '@tinystacks/ops-model';

type Json = {
  [key: string]: any;
}

type FlatMap = {
  [key: string]: string;
}

type Ref = {
  $ref: string;
}

type GenericWidgetType = Widget & Json;

type YamlTab = Omit<Tab, 'widgetIds'> & YamlWidget & {
  widgets: Ref[];
}

type YamlTabPanel = Omit<TabPanel, 'tabs' | 'providerId'> & { 
  tabs: Record<string, YamlTab>
}

type YamlWidget  = Omit< Widget, 'providerId'> & YamlTabPanel & {
  provider: Ref;
};

type YamlPage = Omit<Page, 'widgetIds'> &  {
  widgets: Ref[];
}

type YamlProvider = Provider | AwsProfileProvider;

type YamlConsoleProperties = Omit<Console, 'providers' | 'pages' | 'widgets'> & {
  providers: {
    [id: string]: YamlProvider
  };
  pages: {
    [id: string]: YamlPage
  };
  widgets: {
    [id: string]: YamlWidget
  };
}
type YamlConsole = {
  Console: YamlConsoleProperties;
}

type TinyStacksErrorObject = Omit<TinyStacksError, 'type'> & {
  type: TinyStacksError.type | string
}

export {
  Json,
  FlatMap,
  Ref,
  GenericWidgetType,
  YamlWidget,
  YamlPage,
  YamlProvider,
  YamlConsole,
  YamlTab,
  YamlConsoleProperties,
  TinyStacksErrorObject
};