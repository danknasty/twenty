import { Field, InputType } from '@nestjs/graphql';

import { AppAgentCapability } from 'src/modules/executive-search/common/enums/app-agent-capability.enum';

@InputType()
export class AiDraftRequestDTO {
  @Field(() => AppAgentCapability)
  category: AppAgentCapability;

  @Field(() => String)
  subjectEntityName: string;

  @Field(() => String)
  subjectEntityId: string;

  @Field(() => String, { nullable: true })
  additionalInstructions?: string;
}
