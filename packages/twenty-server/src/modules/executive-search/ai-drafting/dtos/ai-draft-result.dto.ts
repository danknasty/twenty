import { Field, ObjectType } from '@nestjs/graphql';

import { DraftStatus } from 'src/modules/executive-search/ai-drafting/enums/draft-status.enum';
import { DraftType } from 'src/modules/executive-search/ai-drafting/enums/draft-type.enum';

/**
 * Provenance metadata recorded for every AI draft produced.
 */
@ObjectType('AiDraftProvenance')
export class AiDraftProvenanceDTO {
  @Field(() => String)
  capability: string;

  @Field(() => DraftType)
  draftType: DraftType;

  @Field(() => String, { nullable: true })
  assignmentId: string | null;

  @Field(() => String)
  modelId: string;

  @Field(() => String)
  promptTemplateId: string;

  @Field(() => String)
  promptTemplateVersion: string;

  @Field(() => String)
  inputHash: string;

  @Field(() => String, { nullable: true })
  redactionManifest: string | null;

  @Field(() => String)
  generatedAt: string;
}

/**
 * Wrapper output for every AI drafting mutation.
 * All outputs are draft-only — never auto-applied.
 */
@ObjectType('AiDraftResult')
export class AiDraftResultDTO {
  @Field(() => DraftType)
  draftType: DraftType;

  @Field(() => DraftStatus)
  status: DraftStatus;

  @Field(() => String, { nullable: true })
  draftContent: string | null;

  @Field(() => AiDraftProvenanceDTO, { nullable: true })
  provenance: AiDraftProvenanceDTO | null;

  @Field(() => String, {
    nullable: true,
    description:
      'Human-readable label: "AI-generated draft — requires human review before use."',
  })
  draftLabel: string | null;

  @Field(() => String, { nullable: true })
  error: string | null;

  @Field(() => Boolean, {
    description:
      'True when the capability was disabled by its kill switch or the master drafting switch.',
  })
  isKillSwitched: boolean;
}
