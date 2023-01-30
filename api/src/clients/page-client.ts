import isNil from 'lodash.isnil';
import Page from '../classes/page';
import HttpError from 'http-errors';
import ConsoleClient from './console-client';

// TODO: should we make this a class that implement a PageClient interface?
const LocalClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message?.replaceAll('console', 'page');
      }
    }
    throw error;
  },
  async getLocalPage (consoleName: string, pageRoute: string): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      return console.pages?.find(page => page.route === pageRoute);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async getLocalPages (consoleName: string): Promise<Page[]> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      return console.pages;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createLocalPage (consoleName: string, page: Page): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages?.find(p => p.route === page.route);
      if (existingPage) throw HttpError.Conflict(`Cannot create new page with route ${page.route} because a page with this route already exists on console ${consoleName}!`);
      console.addPage(page);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getLocalPage(consoleName, page.route);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updateLocalPage (consoleName: string, pageRoute: string, page: Page): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPageIndex = console.pages?.findIndex(p => p.route === pageRoute);
      if (existingPageIndex === -1) throw HttpError.BadRequest(`Cannot update page with route ${pageRoute} because this page does not exist on console ${consoleName}!`);
      // No trickery allowed.
      page.route = pageRoute;
      console.updatePage(existingPageIndex, page);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getLocalPage(consoleName, page.route);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deleteLocalPage (consoleName: string, pageRoute: string): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages?.find(p => p.route === pageRoute);
      if (isNil(existingPage)) throw HttpError.BadRequest(`Cannot delete page with route ${pageRoute} because this page does not exist on console ${consoleName}!`);
      console.deletePage(pageRoute);
      await ConsoleClient.saveConsole(console.name, console);
      return existingPage;
    } catch (error) {
      return this.handleError(error);
    }
  }
};

const PageClient = {
  async getPages (consoleName: string): Promise<Page[]> {
    // TODO: Add switching based on context for sourcing from other places.
    return await LocalClient.getLocalPages(consoleName);
  },
  async createPage (consoleName: string, page: Page): Promise<Page> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.createLocalPage(consoleName, page);
  },
  async updatePage (consoleName: string, pageRoute: string, page: Page): Promise<Page> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.updateLocalPage(consoleName, pageRoute, page);
  },
  async deletePage (consoleName: string, pageRoute: string): Promise<Page> {
    // TODO: Add switching based on context for sourcing from other places.
    return LocalClient.deleteLocalPage(consoleName, pageRoute);
  }
};

export {
  PageClient,
  LocalClient
};
export default PageClient;