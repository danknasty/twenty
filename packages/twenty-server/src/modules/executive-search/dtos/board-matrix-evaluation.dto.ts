import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum BoardMatrixEvaluationCategory {
  DIRECTOR_INDEPENDENCE = 'DIRECTOR_INDEPENDENCE',
  BOARD_COMMITMENT = 'BOARD_COMMITMENT',
  BOARD_COMPOSITION = 'BOARD_COMPOSITION',
  CANDIDATE_MATRIX = 'CANDIDATE_MATRIX',
}

registerEnumType(BoardMatrixEvaluationCategory, {
  name: 'BoardMatrixEvaluationCategory',
  description: 'Category of board matrix evaluation',
});

export enum BoardMatrixEvaluationRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

registerEnumType(BoardMatrixEvaluationRiskLevel, {
  name: 'BoardMatrixEvaluationRiskLevel',
  description: 'Risk level assigned to a board matrix evaluation finding',
});

export enum BoardMatrixHumanReviewStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  OVERRIDDEN = 'OVERRIDDEN',
}

registerEnumType(BoardMatrixHumanReviewStatus, {
  name: 'BoardMatrixHumanReviewStatus',
  description: 'Status of human review for an advisory evaluation',
});

@ObjectType('BoardMatrixEvaluationFinding')
export class BoardMatrixEvaluationFindingDTO {
  @Field(() => String)
  category: BoardMatrixEvaluationCategory;

  @Field(() => String)
  finding: string;

  @Field(() => BoardMatrixEvaluationRiskLevel)
  riskLevel: BoardMatrixEvaluationRiskLevel;

  @Field(() => String, { nullable: true })
  recommendation: string | null;

  @Field(() => String, { nullable: true })
  evidenceSummary: string | null;
}

@ObjectType('BoardMatrixEvaluationResult')
export class BoardMatrixEvaluationResultDTO {
  @Field(() => Boolean)
  isAdvisory: boolean;

  @Field(() => String)
  riskLevel: string;

  @Field(() => String)
  humanReviewRequired: string;

  @Field(() => BoardMatrixHumanReviewStatus)
  reviewStatus: BoardMatrixHumanReviewStatus;

  @Field(() => [BoardMatrixEvaluationFindingDTO])
  findings: BoardMatrixEvaluationFindingDTO[];

  @Field(() => String)
  evaluatedAt: string;

  @Field(() => String, { nullable: true })
  summary: string | null;
}
