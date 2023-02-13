import { Widget as WidgetType } from "@tinystacks/ops-model";
import Widget from "../../src/classes/widget";
import AwsProfileProvider from "../../src/classes/aws-profile-provider";
import { CloudWatch } from "@aws-sdk/client-cloudwatch";
import dayjs, { ManipulateType } from "dayjs";

enum TimeUnitEnum {
  ns = "ns",
  ms = "ms",
  s = "s",
  m = "m",
  h = "h",
  d = "d",
  w = "w",
  mo = "mo",
  yr = "yr"
}

type KeyValuePair = {
  key: string;
  value: string;
}

type MetricData = {
  value: number;
  unit: string;
}

type Metric = {
  metricNamespace: string;
  metricName: string;
  metricDisplayName: string;
  dimensions: KeyValuePair[];
  data: MetricData[];
}

type TimeRange = {
  startTime: number;
  endTime: number;
}

type RelativeTime = {
  time: number;
  unit: TimeUnitEnum;
}

type AwsCloudWatchMetricGraphType = Omit<WidgetType, 'provider'> & {
  provider: AwsProfileProvider;
  statistic?: string;
  showTimeRangeSelector?: boolean;
  showStatisticSelector?: boolean;
  showPeriodSelector?: boolean;
  metrics: Metric[];
  timeRange?: TimeRange | RelativeTime;
}

class AwsCloudWatchMetricGraph extends Widget implements AwsCloudWatchMetricGraphType {
  static type = 'AwsCloudWatchMetricGraph';
  provider: AwsProfileProvider;
  statistic: string;
  showTimeRangeSelector: boolean;
  showStatisticSelector: boolean;
  showPeriodSelector: boolean;
  metrics: Metric[];
  timeRange: TimeRange | RelativeTime;

  constructor (
    id: string,
    displayName: string,
    provider: AwsProfileProvider,
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean,
    statistic: string = "Average",
    showTimeRangeSelector: boolean = true,
    showStatisticSelector: boolean = true,
    showPeriodSelector: boolean = true,
    metrics: Metric[] = [],
    timeRange: TimeRange | RelativeTime = {
      time: 5,
      unit: TimeUnitEnum.m
    }
  ) {
    super (
      id,
      displayName,
      AwsCloudWatchMetricGraph.type,
      provider,
      showDisplayName,
      description,
      showDescription
    );
    this.provider = provider;
    this.statistic = statistic;
    this.showTimeRangeSelector = showTimeRangeSelector;
    this.showStatisticSelector = showStatisticSelector;
    this.showPeriodSelector = showPeriodSelector;
    this.metrics = metrics;
    this.timeRange = timeRange;
  }

  static fromJson(object: AwsCloudWatchMetricGraphType): AwsCloudWatchMetricGraph {
    const {
      id,
      displayName,
      provider,
      showDisplayName,
      description,
      showDescription,
      statistic,
      showTimeRangeSelector,
      showStatisticSelector,
      showPeriodSelector,
      metrics,
      timeRange
    } = object;
    return new AwsCloudWatchMetricGraph(
      id,
      displayName,
      provider,
      showDisplayName,
      description,
      showDescription,
      statistic,
      showTimeRangeSelector,
      showStatisticSelector,
      showPeriodSelector,
      metrics,
      timeRange
    );
  }

  async getData(): Promise<void> {
    const cwClient = new CloudWatch({});
    let startTime;
    let endTime;
    const abosluteTimeRange = this.timeRange as TimeRange;
    if (abosluteTimeRange.startTime && abosluteTimeRange.endTime) {
      startTime = new Date(abosluteTimeRange.startTime);
      endTime = new Date(abosluteTimeRange.endTime);
    } else {
      const now = dayjs();
      const relativeTimeRange = this.timeRange as RelativeTime;
      const relativeTimeStart = now.subtract(relativeTimeRange.time, relativeTimeRange.unit as ManipulateType);
      endTime = now.toDate();
      startTime = relativeTimeStart.toDate();
    }

    for (const metric of this.metrics) {
      const metricStatsResponse = await cwClient.getMetricStatistics({
        Namespace: metric.metricNamespace,
        MetricName: metric.metricName,
        Dimensions: metric.dimensions.map(dimension => ({
          Name: dimension.key,
          Value: dimension.value
        })),
        Statistics: [this.statistic],
        Period: 60,
        StartTime: startTime,
        EndTime: endTime
      });
      const {
        Datapoints = []
      } = metricStatsResponse;
      metric.data = Datapoints.map(datapoint => ({
        value: Number((datapoint as any)[this.statistic]),
        unit: datapoint.Unit || ''
      }));
    }
  }

}

export {
  AwsCloudWatchMetricGraph
}