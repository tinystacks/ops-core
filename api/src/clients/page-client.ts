import isNil from 'lodash.isnil';
import Page from '../classes/page';
import HttpError from 'http-errors';
import ConsoleClient from './console-client';

const PageClient = {
  handleError (error: unknown): never {
    if (HttpError.isHttpError(error)) {
      if (error.message.includes('CONFIG_PATH') || error.message.includes('Config file')) {
        error.message = error.message?.replaceAll('console', 'page');
      }
    }
    throw error;
  },
  async getPage (consoleName: string, pageRoute: string): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages?.find(page => page.route === pageRoute);
      if (!existingPage) throw HttpError.NotFound(`Page with route ${pageRoute} does not exist in console ${consoleName}!`);
      return existingPage;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async getPages (consoleName: string): Promise<Page[]> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      return console.pages;
    } catch (error) {
      return this.handleError(error);
    }
  },
  async createPage (consoleName: string, page: Page): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages?.find(p => p.route === page.route);
      if (existingPage) throw HttpError.Conflict(`Cannot create new page with route ${page.route} because a page with this route already exists on console ${consoleName}!`);
      console.addPage(page);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getPage(consoleName, page.route);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async updatePage (consoleName: string, pageRoute: string, page: Page): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPageIndex = console.pages?.findIndex(p => p.route === pageRoute);
      if (existingPageIndex === -1) throw HttpError.NotFound(`Cannot update page with route ${pageRoute} because this page does not exist on console ${consoleName}!`);
      // No trickery allowed.
      page.route = pageRoute;
      console.updatePage(existingPageIndex, page);
      await ConsoleClient.saveConsole(console.name, console);
      return this.getPage(consoleName, page.route);
    } catch (error) {
      return this.handleError(error);
    }
  },
  async deletePage (consoleName: string, pageRoute: string): Promise<Page> {
    try {
      const console = await ConsoleClient.getConsole(consoleName);
      const existingPage = console.pages?.find(p => p.route === pageRoute);
      if (isNil(existingPage)) throw HttpError.NotFound(`Cannot delete page with route ${pageRoute} because this page does not exist on console ${consoleName}!`);
      console.deletePage(pageRoute);
      await ConsoleClient.saveConsole(console.name, console);
      return existingPage;
    } catch (error) {
      return this.handleError(error);
    }
  }
};

export default PageClient;