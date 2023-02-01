import isNil from 'lodash.isnil';
import Widget from '../classes/widget';
import HttpError from 'http-errors';
import ConsoleClient from './console-client';

// TODO: should we make this a class that implement a WidgetClient interface?
const WidgetClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message = error.message?.replaceAll('console', 'widget');
      }
    }
    throw error;
  },
  async getWidget (consoleName: string, widgetId: string): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const widget = console.widgets.find(w => w.id === widgetId);
      global.console.debug('widgetId: ', widgetId);
      global.console.debug('console: ', console);
      if (isNil(widget)) throw HttpError.NotFound(`Widget with id ${widgetId} does not exist on console ${consoleName}!`);
      widget.getData();
      return widget;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createWidget (consoleName: string, widget: Widget): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidget = console.widgets?.find(p => p.id === widget.id);
      if (existingWidget) throw HttpError.Conflict(`Cannot create new widget with id ${widget.id} because a widget with this id already exists on console ${consoleName}!`);
      console.addWidget(widget);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getWidget(consoleName, widget.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updateWidget (consoleName: string, widgetId: string, widget: Widget): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidgetIndex = console.widgets?.findIndex(w => w.id === widgetId);
      if (existingWidgetIndex === -1) throw HttpError.NotFound(`Cannot update widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      // No trickery allowed.
      widget.id = widgetId;
      console.updateWidget(existingWidgetIndex, widget);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getWidget(consoleName, widget.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidget = console.widgets?.find(w => w.id === widgetId);
      if (isNil(existingWidget)) throw HttpError.NotFound(`Cannot delete widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      console.deleteWidget(widgetId);
      await ConsoleClient.saveConsole(console.name, console);
      return existingWidget;
    } catch (error) {
      return this.handleError(error);
    }
  }
};
export default WidgetClient;