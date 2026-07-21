import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';
import { DraftingGateService } from 'src/modules/executive-search/services/ai/drafting-gate.service';
import { AssignmentIntakeAssistantService } from 'src/modules/executive-search/services/ai/assignment-intake-assistant.service';
import { PositionSpecificationDraftService } from 'src/modules/executive-search/services/ai/position-specification-draft.service';
import { ResearchStrategyDraftService } from 'src/modules/executive-search/services/ai/research-strategy-draft.service';
import { StatusReportDraftService } from 'src/modules/executive-search/services/ai/status-report-draft.service';
import { CandidatePresentationDraftService } from 'src/modules/executive-search/services/ai/candidate-presentation-draft.service';

/**
 * NestJS module for executive search drafting and synthesis AI capabilities.
 *
 * Phase 16 of the rollout plan (PR31). Registers all AI drafting services:
 * - assignment-intake-assistant
 * - position-specification-draft
 * - research-strategy-draft
 * - status-report-draft
 * - candidate-presentation-draft
 *
 * All services share the `DraftingGateService` for human-review gating and the
 * `AiContextFirewallService` for input sanitization.
 *
 * Each capability has an independent kill switch via the
 * `IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED` feature flag (checked per-service).
 */
@Module({
  imports: [FirewallModule, FeatureFlagModule],
  providers: [
    // Shared human-review gate
    DraftingGateService,

    // AI drafting services
    AssignmentIntakeAssistantService,
    PositionSpecificationDraftService,
    ResearchStrategyDraftService,
    StatusReportDraftService,
    CandidatePresentationDraftService,
  ],
  exports: [
    // Allow other modules to use the shared gate
    DraftingGateService,

    // Export all drafting services for use by resolvers and controllers
    AssignmentIntakeAssistantService,
    PositionSpecificationDraftService,
    ResearchStrategyDraftService,
    StatusReportDraftService,
    CandidatePresentationDraftService,
  ],
})
export class DraftingSynthesisAiModule {}
