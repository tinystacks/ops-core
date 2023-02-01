const mockGetWidget = jest.fn();
const mockCreateWidget = jest.fn();
const mockUpdateWidget = jest.fn();
const mockDeleteWidget = jest.fn();

jest.mock('../../src/clients/widget-client.ts', () => ({
  getWidget: mockGetWidget,
  createWidget: mockCreateWidget,
  updateWidget: mockUpdateWidget,
  deleteWidget: mockDeleteWidget
}));

import { Widget } from '@tinystacks/ops-model';
import WidgetController from '../../src/controllers/widget-controller';

describe('widget controller tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getWidget', async () => {
    await WidgetController.getWidget('mock-console', 'mock-widget');
    expect(mockGetWidget).toBeCalled();
    expect(mockGetWidget).toBeCalledWith('mock-console', 'mock-widget');
  });
  it('postWidget', async () => {
    const requestBody: Widget = {
      id: 'mock-widget',
      displayName: 'Mock Widget',
      type: 'mock-widget'
    };
    await WidgetController.postWidget('mock-console', requestBody);
    expect(mockCreateWidget).toBeCalled();
    expect(mockCreateWidget).toBeCalledWith('mock-console', requestBody);
  });
  it('putWidget', async () => {
    const requestBody: Widget = {
      id: 'mock-widget',
      displayName: 'Mock Widget',
      type: 'mock-widget'
    };
    await WidgetController.putWidget('mock-console', 'mock-widget-2', requestBody);
    expect(mockUpdateWidget).toBeCalled();
    expect(mockUpdateWidget).toBeCalledWith('mock-console', 'mock-widget-2', {
      ...requestBody,
      id: 'mock-widget-2'
    });
  });
  it('deleteWidget', async () => {
    await WidgetController.deleteWidget('mock-console', 'mock-widget');
    expect(mockDeleteWidget).toBeCalled();
    expect(mockDeleteWidget).toBeCalledWith('mock-console', 'mock-widget');
  });
});