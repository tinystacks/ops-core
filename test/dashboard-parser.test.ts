import { Parameter } from '@tinystacks/ops-model';
import { DashboardParser } from '../src/dashboard-parser.js';
import TinyStacksError from '../src/tinystacks-error.js';

const basicDashboard = {
  id: 'MockDashboard',
  route: '/',
  widgetIds: ['MockWidget'],
  parameters: [] as Parameter[],
  description: undefined as string | undefined
};

const yamlDashboard = {
  id: 'MockDashboard',
  route: '/',
  widgets: [{
    '$ref': '#/Console/widgets/MockWidget'
  }],
  parameters: [] as Parameter[],
  description: undefined as string | undefined
};

describe('Dashboard', () => {
  it('constructor does not lose core data', () => {
    const dashboard = new DashboardParser(basicDashboard.route, basicDashboard.widgetIds, basicDashboard.id);
    expect(dashboard.toJson()).toStrictEqual(basicDashboard);
  });
  it('fromJson does not lose core data', () => {
    const dashboard = DashboardParser.fromJson(basicDashboard);
    expect(dashboard.toJson()).toStrictEqual(basicDashboard);
  });
  it('missing widgetIds throws', () => {
    const dashJson: any = { ...basicDashboard };
    delete dashJson.widgetIds;
    const error = TinyStacksError.fromJson({
      message: `Property 'widgetIds' is missing on object type 'Dashboard' object ${JSON.stringify(dashJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      DashboardParser.fromJson(dashJson);
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });
  it('missing route throws', () => {
    const dashJson: any = { ...basicDashboard };
    delete dashJson.route;
    const error = TinyStacksError.fromJson({
      message: `Property 'route' is missing on object type 'Dashboard' object ${JSON.stringify(dashJson)}`,
      status: 400
    });
    let thrownError: any;
    try {
      DashboardParser.fromJson(dashJson);
    } catch (e) {
      thrownError = e;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toEqual(error);
    }
  });

  it('toYaml renders yaml correctly', () => {
    const dashboardYaml = DashboardParser.fromJson(basicDashboard).toYaml();
    expect(dashboardYaml).toStrictEqual(yamlDashboard);
  });
});