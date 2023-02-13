const mockGetPages = jest.fn();
const mockCreatePage = jest.fn();
const mockUpdatePage = jest.fn();
const mockDeletePage = jest.fn();

jest.mock('../../src/clients/page-client.ts', () => ({
  getPages: mockGetPages,
  createPage: mockCreatePage,
  updatePage: mockUpdatePage,
  deletePage: mockDeletePage
}));

import { Page } from '@tinystacks/ops-model';
import PageController from '../../src/controllers/page-controller';

describe('page controller tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getPage', async () => {
    await PageController.getPages('mock-console');
    expect(mockGetPages).toBeCalled();
    expect(mockGetPages).toBeCalledWith('mock-console');
  });
  it('postPage', async () => {
    const requestBody: Page = {
      route: '/mock-page',
      widgetIds: []
    };
    await PageController.postPage('mock-console', requestBody);
    expect(mockCreatePage).toBeCalled();
    expect(mockCreatePage).toBeCalledWith('mock-console', requestBody);
  });
  it('putPage', async () => {
    const requestBody: Page = {
      route: '/mock-page',
      widgetIds: []
    };
    await PageController.putPage('mock-console', '/mock-page-2', requestBody);
    expect(mockUpdatePage).toBeCalled();
    expect(mockUpdatePage).toBeCalledWith('mock-console', '/mock-page-2', {
      ...requestBody,
      route: '/mock-page-2'
    });
  });
  it('deletePage', async () => {
    await PageController.deletePage('mock-console', '/mock-page');
    expect(mockDeletePage).toBeCalled();
    expect(mockDeletePage).toBeCalledWith('mock-console', '/mock-page');
  });
});