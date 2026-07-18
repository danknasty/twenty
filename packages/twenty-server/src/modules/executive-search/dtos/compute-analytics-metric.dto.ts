import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('ComputeAnalyticsMetric')
export class ComputeAnalyticsMetricDTO {
  @Field(() => Number, { nullable: true })
  value: number | null;

  @Field(() => String, { nullable: true })
  valueText: string | null;

  @Field(() => Number, { nullable: true })
  sourceCount: number | null;

  @Field(() => String)
  computedAt: string;

  @Field(() => String)
  computationStatus: string;

  @Field(() => String, { nullable: true })
  snapshotId: string | null;

  @Field(() => String, { nullable: true })
  periodStart: string | null;

  @Field(() => String, { nullable: true })
  periodEnd: string | null;
}
