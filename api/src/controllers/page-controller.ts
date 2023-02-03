import { Page as PageType } from '@tinystacks/ops-model';
import PageClient from '../clients/page-client';
import Page from '../classes/page';

const PageController = {
  async getPages (consoleName: string): Promise<PageType[]> {
    return PageClient.getPages(consoleName);
  },
  async postPage (consoleName: string, createPageBody: PageType): Promise<PageType> {
    const page = Page.fromJson(createPageBody);
    return PageClient.createPage(consoleName, page);
  },
  async putPage (consoleName: string, pageId: string, updatePageBody: PageType): Promise<PageType> {
    const page = Page.fromJson(updatePageBody);
    page.route = pageId;
    return PageClient.updatePage(consoleName, pageId, page);
  },
  async deletePage (consoleName: string, pageId: string): Promise<PageType> {
    return PageClient.deletePage(consoleName, pageId);
  }
};

export default PageController;