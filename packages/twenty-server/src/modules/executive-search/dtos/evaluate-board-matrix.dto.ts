import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('BoardMatrixCriterionResult')
export class BoardMatrixCriterionResultDTO {
  @Field(() => String)
  criterionId: string;

  @Field(() => String)
  criterionName: string;

  @Field(() => Number, { nullable: true })
  score: number | null;

  @Field(() => String, { nullable: true })
  rationale: string | null;

  @Field(() => [String], { nullable: true })
  evidenceSources: string[] | null;

  @Field(() => [String], { nullable: true })
  guardrailFlags: string[] | null;
}

@ObjectType('BoardMatrixEvaluationResult')
export class BoardMatrixEvaluationResultDTO {
  @Field(() => String)
  evaluationId: string;

  @Field(() => String)
  boardCompositionProfileId: string;

  @Field(() => String)
  candidacyId: string;

  @Field(() => [BoardMatrixCriterionResultDTO])
  criteria: BoardMatrixCriterionResultDTO[];

  @Field(() => Number, { nullable: true })
  overallScore: number | null;

  @Field(() => String, { nullable: true })
  summary: string | null;

  @Field(() => String)
  modelId: string;

  @Field(() => String)
  promptVersion: string;

  @Field(() => String)
  status: string;

  @Field(() => String, { nullable: true })
  humanReviewerId: string | null;

  @Field(() => String, { nullable: true })
  humanDecision: string | null;

  @Field(() => String)
  createdAt: string;
}

@ObjectType('EvaluateBoardMatrix')
export class EvaluateBoardMatrixDTO {
  @Field(() => BoardMatrixEvaluationResultDTO)
  result: BoardMatrixEvaluationResultDTO;
}
