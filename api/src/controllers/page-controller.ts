import { Page as PageType } from '@tinystacks/ops-model';
import PageClient from '../clients/page-client';
import Page from '../classes/page';

const PageController = {
  async getPages (consoleName: string): Promise<PageType[]> {
    return PageClient.getPages(consoleName);
  },
  async postPage (consoleName: string, createPageBody: PageType): Promise<PageType> {
    const page = Page.fromObject(createPageBody);
    return PageClient.createPage(consoleName, page);
  },
  async putPage (consoleName: string, pageRoute: string, updatePageBody: PageType): Promise<PageType> {
    const page = Page.fromObject(updatePageBody);
    return PageClient.updatePage(consoleName, pageRoute, page);
  },
  async deletePage (consoleName: string, pageRoute: string): Promise<PageType> {
    return PageClient.deletePage(consoleName, pageRoute);
  }
};

export default PageController;