import {
  AwsProfileProvider,
  Console,
  Page,
  Provider,
  Widget
} from "@tinystacks/ops-model";

type YamlWidget = {
  [WidgetName: string]: Widget
}

type YamlPageProperties = Omit<Page, 'widgets'> & {
  widgets: YamlWidget[]
}
type YamlPage = {
  Page: YamlPageProperties
}

type YamlProvider = {
  [ProviderName: string]: Provider | AwsProfileProvider
}
type YamlConsoleProperties = Omit<Console, 'providers' | 'pages'> & {
  providers: YamlProvider[]
  pages: YamlPage[]
}
type YamlConsole = {
  Console: YamlConsoleProperties
}

export {
  YamlWidget,
  YamlPage,
  YamlProvider,
  YamlConsole
}