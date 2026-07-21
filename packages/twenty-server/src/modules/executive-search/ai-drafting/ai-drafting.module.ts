import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';
import { DraftProvenanceService } from 'src/modules/executive-search/ai-drafting/services/draft-provenance.service';
import { AssignmentIntakeDraftService } from 'src/modules/executive-search/ai-drafting/services/assignment-intake-draft.service';
import { PositionSpecDraftService } from 'src/modules/executive-search/ai-drafting/services/position-spec-draft.service';
import { ResearchStrategyDraftService } from 'src/modules/executive-search/ai-drafting/services/research-strategy-draft.service';
import { StatusReportDraftService } from 'src/modules/executive-search/ai-drafting/services/status-report-draft.service';
import { CandidatePresentationDraftService } from 'src/modules/executive-search/ai-drafting/services/candidate-presentation-draft.service';
import { AiDraftingResolver } from 'src/modules/executive-search/ai-drafting/resolvers/ai-drafting.resolver';

@Module({
  imports: [FeatureFlagModule, FirewallModule],
  providers: [
    DraftProvenanceService,
    AssignmentIntakeDraftService,
    PositionSpecDraftService,
    ResearchStrategyDraftService,
    StatusReportDraftService,
    CandidatePresentationDraftService,
    AiDraftingResolver,
  ],
  exports: [
    DraftProvenanceService,
    AssignmentIntakeDraftService,
    PositionSpecDraftService,
    ResearchStrategyDraftService,
    StatusReportDraftService,
    CandidatePresentationDraftService,
  ],
})
export class AiDraftingModule {}
