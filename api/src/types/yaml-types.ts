import {
  AwsProfileProvider,
  Console,
  Page,
  Provider,
  Widget, 
  TabPanel
} from '@tinystacks/ops-model';

type YamlWidget = Widget & TabPanel;

type YamlPageProperties = Omit<Page, 'widgets'> & {
  id: string,
  widgetIds?: String[]
}
type YamlPage = {
  Page: YamlPageProperties
}

type YamlProvider = {
  [ProviderName: string]: Provider | AwsProfileProvider
}
type YamlConsoleProperties = Omit<Console, 'providers' | 'pages' | 'widgets'> & {
  providers: YamlProvider[]
  pages: YamlPage[]
  widgets: YamlWidget[]
}
type YamlConsole = {
  Console: YamlConsoleProperties
}

export {
  YamlWidget,
  YamlPage,
  YamlProvider,
  YamlConsole, 
  YamlPageProperties
};