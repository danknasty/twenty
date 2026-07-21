import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum SearchHealthCategory {
  STALE_SEARCH = 'STALE_SEARCH',
  BOTTLENECKED_STAGE = 'BOTTLENECKED_STAGE',
  AT_RISK_PLACEMENT = 'AT_RISK_PLACEMENT',
  APPROACHING_GUARANTEE_DEADLINE = 'APPROACHING_GUARANTEE_DEADLINE',
}

registerEnumType(SearchHealthCategory, {
  name: 'SearchHealthCategory',
  description: 'Category of search health advisory finding',
});

export enum SearchHealthSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

registerEnumType(SearchHealthSeverity, {
  name: 'SearchHealthSeverity',
  description: 'Severity level of a search health advisory finding',
});

@ObjectType('SearchHealthAdvisoryFinding')
export class SearchHealthAdvisoryFindingDTO {
  @Field(() => String)
  category: SearchHealthCategory;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => SearchHealthSeverity)
  severity: SearchHealthSeverity;

  @Field(() => String, { nullable: true })
  suggestedAction: string | null;

  @Field(() => String, { nullable: true })
  relatedEntityId: string | null;

  @Field(() => String, { nullable: true })
  relatedEntityType: string | null;
}

@ObjectType('SearchHealthAdvisoryResult')
export class SearchHealthAdvisoryResultDTO {
  @Field(() => Boolean)
  isAdvisory: boolean;

  @Field(() => [SearchHealthAdvisoryFindingDTO])
  findings: SearchHealthAdvisoryFindingDTO[];

  @Field(() => String)
  generatedAt: string;

  @Field(() => String, { nullable: true })
  summary: string | null;

  @Field(() => Number)
  totalFindings: number;
}
