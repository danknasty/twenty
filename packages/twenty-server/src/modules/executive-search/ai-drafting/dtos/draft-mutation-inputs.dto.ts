import { Field, InputType } from '@nestjs/graphql';

@InputType('DraftAssignmentIntakeInput')
export class DraftAssignmentIntakeInputDTO {
  @Field(() => String)
  conversationNotes: string;

  @Field(() => String, { nullable: true })
  opportunityId: string | null;

  @Field(() => String)
  clientCompanyId: string;
}

@InputType('DraftPositionSpecInput')
export class DraftPositionSpecInputDTO {
  @Field(() => String)
  assignmentId: string;

  @Field(() => String, { nullable: true })
  additionalContext: string | null;
}

@InputType('DraftResearchStrategyInput')
export class DraftResearchStrategyInputDTO {
  @Field(() => String)
  positionSpecId: string;

  @Field(() => String, { nullable: true })
  marketMapId: string | null;

  @Field(() => String, { nullable: true })
  researcherNotes: string | null;
}

@InputType('DraftStatusReportInput')
export class DraftStatusReportInputDTO {
  @Field(() => String)
  assignmentId: string;

  @Field(() => String)
  periodStart: string;

  @Field(() => String)
  periodEnd: string;
}

@InputType('DraftCandidatePresentationInput')
export class DraftCandidatePresentationInputDTO {
  @Field(() => String)
  candidacyId: string;

  @Field(() => String)
  assignmentId: string;

  @Field(() => String, { nullable: true })
  presentationContext: string | null;

  @Field(() => Boolean)
  candidateConsented: boolean;
}
