import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('SearchHealthMetric')
export class SearchHealthMetricDTO {
  @Field(() => String)
  metricCode: string;

  @Field(() => String)
  label: string;

  @Field(() => Number, { nullable: true })
  value: number | null;

  @Field(() => String, { nullable: true })
  valueText: string | null;

  @Field(() => String, { nullable: true })
  trend: string | null;

  @Field(() => String, { nullable: true })
  advisory: string | null;

  @Field(() => String, { nullable: true })
  severity: string | null;
}

@ObjectType('SearchHealthAdvisory')
export class SearchHealthAdvisoryDTO {
  @Field(() => String)
  searchAssignmentId: string;

  @Field(() => [SearchHealthMetricDTO])
  metrics: SearchHealthMetricDTO[];

  @Field(() => String, { nullable: true })
  overallHealth: string | null;

  @Field(() => String, { nullable: true })
  summaryAdvisory: string | null;

  @Field(() => String)
  computedAt: string;
}
