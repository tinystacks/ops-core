import { Widget as WidgetType } from '@tinystacks/ops-model';
import WidgetClient from '../clients/widget-client';
// temporary until parser is done and can return instances of plugin classes
import GenericWidget from '../classes/generic-widget';

const WidgetController = {
  async getWidget (consoleName: string, widgetId: string): Promise<WidgetType> {
    return WidgetClient.getWidget(consoleName, widgetId);
  },
  async postWidget (consoleName: string, createWidgetBody: WidgetType): Promise<WidgetType> {
    const widget = GenericWidget.fromObject(createWidgetBody);
    return WidgetClient.createWidget(consoleName, widget);
  },
  async putWidget (consoleName: string, widgetRoute: string, updateWidgetBody: WidgetType): Promise<WidgetType> {
    const widget = GenericWidget.fromObject(updateWidgetBody);
    return WidgetClient.updateWidget(consoleName, widgetRoute, widget);
  },
  async deleteWidget (consoleName: string, widgetRoute: string): Promise<WidgetType> {
    return WidgetClient.deleteWidget(consoleName, widgetRoute);
  }
};

export default WidgetController;