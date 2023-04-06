import { validateConsole, validatePropertyExists, validateProviderReferences, validateWidgetReferences } from '../src/parser-utils.js';

describe('Test Console Validation', () => {
  it('test error thrown for missing property on object', () => {

    const testObject = {
      'type': 'AwsEcsSeviceSummary',
      'displayName': 'Service Logs',
      'awsProviderId': 'AwsLocalProvider',
      'clusterName': 'cdk-synth-cluster',
      'serviceName': 'tinystacks-service'
    };

    let thrownError;
    try {
      validatePropertyExists(testObject, 'id', 'testObject');
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toHaveProperty('message', `Property 'id' is missing on object type 'testObject' object ${JSON.stringify(testObject)}`);
    }
  });
  it('test no error thrown when property exists on object', () => {

    const testObject = {
      'id': 'EcsWidget',
      'type': 'AwsEcsSeviceSummary',
      'displayName': 'Service Logs',
      'awsProviderId': 'AwsLocalProvider',
      'clusterName': 'cdk-synth-cluster',
      'serviceName': 'tinystacks-service'
    };

    let thrownError;
    try {
      validatePropertyExists(testObject, 'id', 'testObject');
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).not.toBeDefined();
    }


  });

  it('test error for missing widget reference', () => {

    const testWidgets = {
      'SynthEcsServiceDeployments_1': {
        'type': 'AwsEcsSeviceSummary',
        'id': 'SynthEcsServiceDeployments_1',
        'displayName': 'Service Logs',
        'provider': { $ref: '#/Console/providers/AwsLocalProvider' },
        'tabs': {}

      },
      'SynthEcsServiceDeployments_2': {
        'type': 'AwsEcsServiceDeployments',
        'id': 'synth-ecs-service-deployments-2',
        'displayName': 'Service Logs',
        'provider': { $ref: '#/Console/providers/AwsLocalProvider' },
        'tabs': {}
      }
    };

    const widgetRefs = ['SynthEcsServiceDeployments_1', 'SynthEcsServiceDeployments_3'];

    let thrownError;
    try {
      validateWidgetReferences(testWidgets, widgetRefs);
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toHaveProperty('message', 'Widget reference SynthEcsServiceDeployments_3 is not defined');
    }
  });

  it('test no error when all widget references are defined', () => {

    const testWidgets = {
      'SynthEcsServiceDeployments_1': {
        'type': 'AwsEcsSeviceSummary',
        'id': 'SynthEcsServiceDeployments_1',
        'displayName': 'Service Logs',
        'provider': { $ref: '#/Console/providers/AwsLocalProvider' },
        'tabs': {}

      },
      'SynthEcsServiceDeployments_2': {
        'type': 'AwsEcsServiceDeployments',
        'id': 'synth-ecs-service-deployments-2',
        'displayName': 'Service Logs',
        'provider': { $ref: '#/Console/providers/AwsLocalProvider' },
        'tabs': {}
      }
    };

    const widgetRefs = ['SynthEcsServiceDeployments_1', 'SynthEcsServiceDeployments_2'];

    let thrownError;
    try {
      validateWidgetReferences(testWidgets, widgetRefs);
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).not.toBeDefined();
    }
  });
});

describe('validateProviderReferences', () => {
  it('throws if a referenced provider is not in the providers map', () => {
    const providers = {
      MockProvider: {
        id: 'MockProvider',
        type: 'MockProvider'
      }
    };
    const providerReferences = ['MockProvider', 'MockProvider2'];
    let thrownError;
    try {
      validateProviderReferences(providers, providerReferences);
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).toHaveProperty('message', 'Provider reference MockProvider2 is not defined');
    }
  });
  it('does not throw if all referenced providers are present', () => {
    const providers = {
      MockProvider: {
        id: 'MockProvider',
        type: 'MockProvider'
      },
      MockProvider2: {
        id: 'MockProvider2',
        type: 'MockProvider2'
      }
    };
    const providerReferences = ['MockProvider', 'MockProvider2'];
    let thrownError;
    try {
      validateProviderReferences(providers, providerReferences);
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).toBeUndefined();
    }
  });
});

test('validateConsole', () => {
  const console = {
    name: 'mock-console',
    providers: {
      MockProvider: {
        id: 'MockProvider',
        type: 'MockProvider'
      }
    },
    dashboards: {
      Main: {
        id: 'Main',
        route: '/main',
        widgetIds: ['MockWidget']
      }
    },
    widgets: {
      MockWidget: {
        id: 'MockWidget',
        displayName: 'Mock Widget',
        type: 'MockWidget',
        providerIds: ['MockProvider'],
        childrenIds: ['MockWidget2']
      },
      MockWidget2: {
        id: 'MockWidget2',
        displayName: 'Mock Widget 2',
        type: 'MockWidget2',
        providerIds: ['MockProvider']
      }
    },
    dependencies: {
      MockProvider: '@mock/ops-console-plugins',
      MockWidget: '@mock/ops-console-plugins',
      MockWidget2: '@mock/ops-console-plugins'
    }
  };

  expect(() => validateConsole(console)).not.toThrow();
});

/*
  it("test error thrown for missing properties on widget", () => {

    const testWidgets = [
      {
        "type": "AwsEcsSeviceSummary",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service"
      },
      {
        "type": "AwsEcsServiceDeployments",
        "id": "synth-ecs-service-deployments-2",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service",
        "showTaskDetails": true,
        "showPermissions": true,
        "tabbedView": false
      }];

      let thrownError;
      try {
        new Parser().validatePropertiesOnWidgets(testWidgets);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(thrownError).toBeDefined();
        expect(thrownError).toHaveProperty('message', 'Error validating property id on object Widget');
      }


  });
  it("test error thrown for duplicate widget ids", () => {

    const testWidgets = [
      {
        "type": "AwsEcsSeviceSummary",
        "id": "synth-ecs-service-deployments",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service"
      },
      {
        "type": "AwsEcsServiceDeployments",
        "id": "synth-ecs-service-deployments",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service",
        "showTaskDetails": true,
        "showPermissions": true,
        "tabbedView": false
      }
    ];

    let thrownError;
    try {
      new ParsingService().validateUniqueIdsForWidgets(testWidgets);
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toHaveProperty('message', 'Error found overlapping ids in Widgets');
    }
  });
  it("test error for missing widget reference", () => {

    const testWidgets = [
      {
        "type": "AwsEcsSeviceSummary",
        "id": "synth-ecs-service-deployments-1",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service"
      },
      {
        "type": "AwsEcsServiceDeployments",
        "id": "synth-ecs-service-deployments-2",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service",
      }
    ];

    const widgetIds = ["synth-ecs-service-deployments-1", "synth-ecs-service-deployments-2", "synth-ecs-service-deployments-3"];

    let thrownError;
    try {
      new ParsingService().validateAllWidgetsDefined(widgetIds, testWidgets);
      //validateAllWidgetsDefined
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).toBeDefined();
      expect(thrownError).toHaveProperty('message', 'Widget with id synth-ecs-service-deployments-3 is not defined');
    }
  });
  it("test no error thrown when all widgets are defined", () => {

    const testWidgets = [
      {
        "type": "AwsEcsSeviceSummary",
        "id": "synth-ecs-service-deployments-1",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service"
      },
      {
        "type": "AwsEcsServiceDeployments",
        "id": "synth-ecs-service-deployments-2",
        "displayName": "Service Logs",
        "awsProviderId": "AwsLocalProvider",
        "clusterName": "cdk-synth-cluster",
        "serviceName": "tinystacks-service",
      }
    ];

    const widgetIds = ["synth-ecs-service-deployments-1", "synth-ecs-service-deployments-2"];

    let thrownError;
    try {
      new ParsingService().validateAllWidgetsDefined(widgetIds, testWidgets);
    } catch (error) {
      thrownError = error;
    } finally {
      expect(thrownError).not.toBeDefined();
    }
  });
  */