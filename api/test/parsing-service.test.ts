/*
import { ParsingService } from '../src/parsing-service';

describe("Test Widget Validation", () => {
  test("test error thrown for missing properties on widget", () => {

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
        new ParsingService().validatePropertiesOnWidgets(testWidgets);
      } catch (error) {
        thrownError = error;
      } finally { 
        expect(thrownError).toBeDefined();
        expect(thrownError).toHaveProperty('message', 'Error validating property id on object Widget');
      }
    

  });
  test("test error thrown for duplicate widget ids", () => {

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
  test("test error for missing widget reference", () => {

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
  test("test no error thrown when all widgets are defined", () => {

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
});

*/