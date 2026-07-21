import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';
import { NaturalLanguageSearchFilterService } from 'src/modules/executive-search/services/ai/natural-language-search-filter.service';
import { TargetCompanySuggestionService } from 'src/modules/executive-search/services/ai/target-company-suggestion.service';
import { RelationshipPathSuggestionService } from 'src/modules/executive-search/services/ai/relationship-path-suggestion.service';

@Module({
  imports: [FirewallModule, FeatureFlagModule],
  providers: [
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
export class ResearchAiModule {}
