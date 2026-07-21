import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CriterionAssessmentEvaluation {
  @Field(() => String)
  evaluationId: string;

  @Field(() => String)
  criterionName: string;

  @Field(() => Number, { nullable: true })
  aiRating: number | null;

  @Field(() => Boolean)
  isHumanReviewed: boolean;
}

@ObjectType()
export class GenerateCriterionAssessmentsResult {
  @Field(() => String)
  candidacyId: string;

  @Field(() => Number)
  evaluationCount: number;

  @Field(() => [CriterionAssessmentEvaluation])
  evaluations: CriterionAssessmentEvaluation[];
}

@ObjectType()
export class SubmitCriterionEvaluationResult {
  @Field(() => String)
  evaluationId: string;

  @Field(() => Boolean)
  isHumanReviewed: boolean;
}
