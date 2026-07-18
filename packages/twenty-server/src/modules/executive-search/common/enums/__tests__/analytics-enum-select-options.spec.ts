import { AnalyticsAggregationType } from '../analytics-aggregation-type.enum';
import { AnalyticsComputationStatus } from '../analytics-computation-status.enum';
import { AnalyticsDashboardAudience } from '../analytics-dashboard-audience.enum';
import { AnalyticsDashboardScope } from '../analytics-dashboard-scope.enum';
import { AnalyticsMetricCategory } from '../analytics-metric-category.enum';
import { AnalyticsMetricStatus } from '../analytics-metric-status.enum';
import { AnalyticsMetricValueType } from '../analytics-metric-value-type.enum';
import { AnalyticsRefreshFrequency } from '../analytics-refresh-frequency.enum';
import { AnalyticsTimeWindow } from '../analytics-time-window.enum';

/**
 * Helper: extract the enum's values (the right-hand side of each member)
 * as a sorted array so comparison is order-independent.
 */
function enumValues<T extends Record<string, string>>(
  e: T,
): string[] {
  return Object.values(e).sort();
}

describe('analyticsDomainMetric SELECT fields', () => {
  it('category options match AnalyticsMetricCategory enum values', () => {
    const expected = enumValues(AnalyticsMetricCategory);
    // Options from compute-analytics-domain-metric-standard-flat-field-metadata.util.ts
    const actual = [
      'PIPELINE',
      'FINANCIAL',
      'CLIENT',
      'CANDIDACY',
      'PLACEMENT',
      'BOARD',
      'RESEARCH',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('aggregationType options match AnalyticsAggregationType enum values', () => {
    const expected = enumValues(AnalyticsAggregationType);
    const actual = [
      'COUNT',
      'SUM',
      'AVERAGE',
      'RATIO',
      'PERCENTAGE',
      'MEDIAN',
      'PERCENTILE',
      'CUSTOM',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('valueType options match AnalyticsMetricValueType enum values', () => {
    const expected = enumValues(AnalyticsMetricValueType);
    const actual = [
      'NUMBER',
      'CURRENCY',
      'PERCENTAGE',
      'DURATION_DAYS',
      'COUNT',
      'RATIO',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('timeWindow options match AnalyticsTimeWindow enum values', () => {
    const expected = enumValues(AnalyticsTimeWindow);
    const actual = [
      'POINT_IN_TIME',
      'DAY',
      'WEEK',
      'MONTH',
      'QUARTER',
      'YEAR',
      'TRAILING_30D',
      'TRAILING_90D',
      'TRAILING_365D',
      'LIFETIME',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('status options match AnalyticsMetricStatus enum values', () => {
    const expected = enumValues(AnalyticsMetricStatus);
    const actual = ['DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED'].sort();
    expect(actual).toEqual(expected);
  });
});

describe('analyticsMetricSnapshot SELECT fields', () => {
  it('granularity options match AnalyticsTimeWindow enum values', () => {
    const expected = enumValues(AnalyticsTimeWindow);
    const actual = [
      'POINT_IN_TIME',
      'DAY',
      'WEEK',
      'MONTH',
      'QUARTER',
      'YEAR',
      'TRAILING_30D',
      'TRAILING_90D',
      'TRAILING_365D',
      'LIFETIME',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('computationStatus options match AnalyticsComputationStatus enum values', () => {
    const expected = enumValues(AnalyticsComputationStatus);
    const actual = ['SUCCESS', 'PARTIAL', 'FAILED', 'STALE'].sort();
    expect(actual).toEqual(expected);
  });
});

describe('analyticsDashboardConfig SELECT fields', () => {
  it('scope options match AnalyticsDashboardScope enum values', () => {
    const expected = enumValues(AnalyticsDashboardScope);
    const actual = [
      'FIRM_WIDE',
      'PRACTICE_GROUP',
      'TEAM',
      'CLIENT',
      'ASSIGNMENT',
      'PERSONAL',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('audience options match AnalyticsDashboardAudience enum values', () => {
    const expected = enumValues(AnalyticsDashboardAudience);
    const actual = [
      'MANAGING_PARTNER',
      'PRACTICE_LEADER',
      'FINANCE_OPS',
      'SEARCH_PARTNER',
      'ALL_INTERNAL',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('defaultTimeRange options match AnalyticsTimeWindow enum values', () => {
    const expected = enumValues(AnalyticsTimeWindow);
    const actual = [
      'POINT_IN_TIME',
      'DAY',
      'WEEK',
      'MONTH',
      'QUARTER',
      'YEAR',
      'TRAILING_30D',
      'TRAILING_90D',
      'TRAILING_365D',
      'LIFETIME',
    ].sort();
    expect(actual).toEqual(expected);
  });

  it('refreshFrequency options match AnalyticsRefreshFrequency enum values', () => {
    const expected = enumValues(AnalyticsRefreshFrequency);
    const actual = ['REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MANUAL'].sort();
    expect(actual).toEqual(expected);
  });

  it('status options match AnalyticsMetricStatus enum values', () => {
    const expected = enumValues(AnalyticsMetricStatus);
    const actual = ['DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED'].sort();
    expect(actual).toEqual(expected);
  });
});
