import { Module } from '@nestjs/common';

import { AiAgentExecutionModule } from 'src/engine/metadata-modules/ai/ai-agent-execution/ai-agent-execution.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';
import { ResearchAiProvenanceService } from 'src/modules/executive-search/research-ai/services/research-ai-provenance.service';
import { NlSearchFilterService } from 'src/modules/executive-search/research-ai/services/nl-search-filter.service';
import { TargetCompanySuggestionService } from 'src/modules/executive-search/research-ai/services/target-company-suggestion.service';
import { RelationshipPathSuggestionService } from 'src/modules/executive-search/research-ai/services/relationship-path-suggestion.service';

@Module({
  imports: [
    // AI agent execution infrastructure (provides AgentRunService)
    AiAgentExecutionModule,
    // AI context firewall for input field validation
    FirewallModule,
  ],
  providers: [
    // Shared provenance recording
    ResearchAiProvenanceService,
    // Research AI capability services
    NlSearchFilterService,
    TargetCompanySuggestionService,
    RelationshipPathSuggestionService,
  ],
  exports: [
    NlSearchFilterService,
    TargetCompanySuggestionService,
    RelationshipPathSuggestionService,
  ],
})
export class ResearchAiModule {}
