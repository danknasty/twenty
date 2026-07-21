import { Field, ObjectType } from '@nestjs/graphql';

import { AppAgentCapability } from 'src/modules/executive-search/common/enums/app-agent-capability.enum';

@ObjectType()
export class AiDraftResultDTO {
  @Field(() => String)
  draftId: string;

  @Field(() => AppAgentCapability)
  category: AppAgentCapability;

  @Field(() => String)
  draftText: string;

  @Field(() => String)
  modelUsed: string;

  @Field(() => String)
  promptVersion: string;

  @Field(() => String)
  generatedAt: string;

  @Field(() => Boolean)
  requiresHumanReview: boolean;

  @Field(() => String, { nullable: true })
  redactionManifest?: string;

  @Field(() => String, { nullable: true })
  guardrailResults?: string;
}
