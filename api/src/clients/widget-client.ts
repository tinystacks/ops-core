import isNil from 'lodash.isnil';
import Widget from '../classes/widget';
import HttpError from 'http-errors';
import ConsoleClient from './console-client';
import { Json } from '../types';
import { Widget as WidgetType } from '@tinystacks/ops-model';
import GenericWidget from '../classes/generic-widget';

type WidgetHolder = Json & {
  widgets?: WidgetType[]
};

// TODO: should we make this a class that implement a WidgetClient interface?
const LocalClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message?.replaceAll('console', 'widget');
      }
    }
    throw error;
  },
  async getLocalWidget (consoleName: string, widgetId: string): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      // FIXME: Delete this and replace with console.widgets when implemented
      const widget = console.widgets.find(w => w.id === widgetId);
      if (isNil(widget)) throw HttpError.NotFound(`Widget with id ${widgetId} does not exist on console ${consoleName}!`)
      widget.getData();
      return widget;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createLocalWidget (consoleName: string, widget: Widget): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidget = console.widgets?.find(p => p.id === widget.id);
      if (existingWidget) throw HttpError.Conflict(`Cannot create new widget with id ${widget.id} because a widget with this route already exists on console ${consoleName}!`);
      console.addWidget(widget);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getLocalWidget(consoleName, widget.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updateLocalWidget (consoleName: string, widgetId: string, widget: Widget): Promise<Widget> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingWidgetIndex = console.widgets?.findIndex(w => w.id === widgetId);
      if (existingWidgetIndex === -1) throw HttpError.NotFound(`Cannot update widget with id ${widgetId} because this widget does not exist on console ${consoleName}!`);
      // No trickery allowed.
      widget.id = widgetId;
      console.updateWidget(existingWidgetIndex, widget);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getLocalWidget(consoleName, widget.id);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteLocalWidget (consoleName: string, widgetId: string): Promise<Widget> {
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

const WidgetClient = {
  async getWidget (consoleName: string, widgetId: string): Promise<Widget> {
    // TODO: Add switching based on context for sourcing from other places.
    return await LocalClient.getLocalWidget(consoleName, widgetId);
  },
  async createWidget (consoleName: string, widget: Widget): Promise<Widget> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.createLocalWidget(consoleName, widget);
  },
  async updateWidget (consoleName: string, widgetId: string, widget: Widget): Promise<Widget> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.updateLocalWidget(consoleName, widgetId, widget);
  },
  async deleteWidget (consoleName: string, widgetId: string): Promise<Widget> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.deleteLocalWidget(consoleName, widgetId);
  }
};

export {
  WidgetClient,
  LocalClient
};
export default WidgetClient;