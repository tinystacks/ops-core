const mockGetConsole = jest.fn();
const mockSaveConsole = jest.fn();

jest.mock('../../src/clients/console-client', () => ({
  getConsole: mockGetConsole,
  saveConsole: mockSaveConsole
}));

import Console from '../../src/classes/console';
import GenericWidget from '../../src/classes/generic-widget';
import WidgetClient from '../../src/clients/widget-client';
import HttpError from 'http-errors';

describe('widget client tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('handleError', () => {
    describe('reuses console client errors when possible', () => {
      it('CONFIG_PATH', () => {
        const error = HttpError.InternalServerError('Cannot fetch consoles! No value was found for CONFIG_PATH!');
        let thrownError;
        try {
          WidgetClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.InternalServerError('Cannot fetch widgets! No value was found for CONFIG_PATH!')
          );
        }
      });
      it('Config file', () => {
        const error = HttpError.NotFound('Cannot fetch consoles! Config file test.yml not found!');
        let thrownError;
        try {
          WidgetClient.handleError(error);
        } catch (e) {
          thrownError = e;
        } finally {
          expect(thrownError).toBeDefined();
          expect(thrownError).toEqual(
            HttpError.NotFound('Cannot fetch widgets! Config file test.yml not found!')
          );
        }
      });
    });
    it('re-throws error', () => {
      const error = new Error('Error!');
      let thrownError;
      try {
        WidgetClient.handleError(error);
      } catch (e) {
        thrownError = e;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(error);
      }
    });
  });
  describe('getWidget', () => {
    it('returns widget from console matching the id specified', async () => {
      const mockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          [mockWidget.id]: mockWidget
        },
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await WidgetClient.getWidget('mock-console', 'mock-id');

      expect(result).toEqual(mockWidget);
    });
    it('throws not found if widget does not exist on the console', async () => {
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {},
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      let thrownError;
      try {
        await WidgetClient.getWidget('mock-console', 'mock-id');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Widget with id mock-id does not exist on console mock-console!')
        );
      }
    });
  });

  describe('getWidgets', () => {
    it('returns widgets from console', async () => {
      const mockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          [mockWidget.id]: mockWidget
        },
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await WidgetClient.getWidget('mock-console', 'mock-id');

      expect(result).toEqual(mockWidget);
    });
    it('throws if an error occurs', async () => {
      const mockError = new Error('Error!');
      mockGetConsole.mockImplementationOnce(()=> { throw mockError; });

      let thrownError;
      try {
        await WidgetClient.getWidget('mock-console', 'mock-id');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
  describe('createWidget', () => {
    it('saves widget to console and returns saved widget', async () => {
      const mockWidget = GenericWidget.fromJson({
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {},
        providers: {},
        pages: {}
      });
      const mockSavedConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          'MockWidget': {
            ...mockWidget,
            id: 'MockWidget'
          }
        },
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      mockGetConsole.mockResolvedValueOnce(mockSavedConsole);
      jest.spyOn(WidgetClient, 'getWidget');

      const result = await WidgetClient.createWidget('mock-console', mockWidget);

      expect(mockGetConsole).toBeCalledTimes(2);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledWith('mock-console', mockSavedConsole);
      expect(WidgetClient.getWidget).toBeCalledTimes(1);
      expect(result).toEqual({
        ...mockWidget,
        id: 'MockWidget'
      });
    });
    it('throws Conflict if widget already exists on console', async () => {
      const mockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          [mockWidget.id]: mockWidget
        },
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(WidgetClient, 'getWidget');

      let thrownError;
      try {
        await WidgetClient.createWidget('mock-console', mockWidget);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(WidgetClient.getWidget).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.Conflict('Cannot create new widget with id mock-id because a widget with this id already exists on console mock-console!')
        );
      }
    });
  });
  describe('updateWidget', () => {
    it('saves widget to console and returns saved widget', async () => {
      const oldMockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const oldMockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          [oldMockWidget.id]: oldMockWidget
        },
        providers: {},
        pages: {}
      });
      const newMockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget 2',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const newMockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          [newMockWidget.id]: newMockWidget
        },
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(oldMockConsole);
      mockGetConsole.mockResolvedValueOnce(newMockConsole);
      jest.spyOn(WidgetClient, 'getWidget');

      const result = await WidgetClient.updateWidget('mock-console', 'mock-id', newMockWidget);

      expect(mockGetConsole).toBeCalledTimes(2);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(WidgetClient.getWidget).toBeCalledTimes(1);
      expect(result).toEqual(newMockWidget);
    });
    it('throws NotFound if widget does not exist on console', async () => {
      const mockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {},
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(WidgetClient, 'getWidget');

      let thrownError;
      try {
        await WidgetClient.updateWidget('mock-console', 'mock-id', mockWidget);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(WidgetClient.getWidget).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Cannot update widget with id mock-id because this widget does not exist on console mock-console!')
        );
      }
    });
  });
  describe('deleteWidget', () => {
    it('deletes widget from console and returns deleted widget', async () => {
      const mockWidget = GenericWidget.fromJson({
        id: 'mock-id',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerId: 'MockProvider'
      });
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {
          [mockWidget.id]: mockWidget
        },
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);

      const result = await WidgetClient.deleteWidget('mock-console', 'mock-id');

      expect(mockGetConsole).toBeCalledTimes(1);
      expect(mockSaveConsole).toBeCalledTimes(1);
      expect(result).toEqual(mockWidget);
    });
    it('throws NotFound if widget does not exist on console', async () => {
      const mockConsole = Console.fromJson({
        name: 'mock-console',
        widgets: {},
        providers: {},
        pages: {}
      });
      mockGetConsole.mockResolvedValueOnce(mockConsole);
      jest.spyOn(WidgetClient, 'getWidget');

      let thrownError;
      try {
        await WidgetClient.deleteWidget('mock-console', 'mock-id');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockGetConsole).toBeCalledTimes(1);
        expect(mockSaveConsole).not.toBeCalled();
        expect(WidgetClient.getWidget).not.toBeCalled();

        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(
          HttpError.NotFound('Cannot delete widget with id mock-id because this widget does not exist on console mock-console!')
        );
      }
    });
  });
});