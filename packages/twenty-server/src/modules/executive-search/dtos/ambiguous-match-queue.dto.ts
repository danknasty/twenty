import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';
import { IdentityMatchResolution } from 'src/modules/executive-search/common/enums/identity-match-resolution.enum';

registerEnumType(IdentityMatchConfidence, {
  name: 'IdentityMatchConfidence',
  description: 'Confidence level of an identity match',
});

registerEnumType(IdentityMatchResolution, {
  name: 'IdentityMatchResolution',
  description: 'Resolution state of an ambiguous match queue entry',
});

@ObjectType('CandidateMatch')
export class CandidateMatchDTO {
  @Field(() => String)
  twentyEntityName: string;

  @Field(() => String)
  twentyRecordId: string;

  @Field(() => IdentityMatchConfidence)
  confidence: IdentityMatchConfidence;
}

@ObjectType('AmbiguousMatchQueueEntry')
export class AmbiguousMatchQueueEntryDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  externalSystemName: string;

  @Field(() => String)
  externalEntityName: string;

  @Field(() => String)
  externalRecordId: string;

  @Field(() => String, { nullable: true })
  externalNaturalKey: string | null;

  @Field(() => String, { nullable: true })
  matchedTwentyEntityName: string | null;

  @Field(() => IdentityMatchConfidence)
  matchConfidence: IdentityMatchConfidence;

  @Field(() => IdentityMatchResolution)
  resolutionState: IdentityMatchResolution;

  @Field(() => String, { nullable: true })
  resolvedTwentyEntityName: string | null;

  @Field(() => String, { nullable: true })
  resolvedTwentyRecordId: string | null;

  @Field(() => Date, { nullable: true })
  resolvedAt: Date | null;

  @Field(() => String, { nullable: true })
  resolvedById: string | null;
}

@ObjectType('ResolveAmbiguousMatchResult')
export class ResolveAmbiguousMatchResultDTO {
  @Field(() => String)
  queueId: string;

  @Field(() => IdentityMatchResolution)
  resolutionState: IdentityMatchResolution;
}
