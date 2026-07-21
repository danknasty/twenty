/* @license Enterprise */

import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';

import { AiResearchKillSwitchService } from './services/ai-research-kill-switch.service';
import { NaturalLanguageSearchFilterService } from './services/natural-language-search-filter.service';
import { RelationshipPathSuggestionService } from './services/relationship-path-suggestion.service';
import { TargetCompanySuggestionService } from './services/target-company-suggestion.service';

@Module({
  imports: [FeatureFlagModule, FirewallModule],
  providers: [
    AiResearchKillSwitchService,
    NaturalLanguageSearchFilterService,
    TargetCompanySuggestionService,
    RelationshipPathSuggestionService,
  ],
  exports: [
    NaturalLanguageSearchFilterService,
    TargetCompanySuggestionService,
    RelationshipPathSuggestionService,
  ],
})
export class AiResearchModule {}
