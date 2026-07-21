import { Test, TestingModule } from '@nestjs/testing';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';

import { AiResearchModule } from '../ai-research.module';
import { AiResearchKillSwitchService } from '../services/ai-research-kill-switch.service';
import { NaturalLanguageSearchFilterService } from '../services/natural-language-search-filter.service';
import { RelationshipPathSuggestionService } from '../services/relationship-path-suggestion.service';
import { TargetCompanySuggestionService } from '../services/target-company-suggestion.service';

describe('AiResearchModule', () => {
  it('compiles the module and resolves all providers', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AiResearchModule],
    })
      .overrideModule(FeatureFlagModule)
      .useModule({
        module: class FeatureFlagOverrideModule {},
        providers: [],
        exports: [],
        global: true,
      })
      .overrideModule(FirewallModule)
      .useModule({
        module: class FirewallOverrideModule {},
        providers: [],
        exports: [],
        global: true,
      })
      .compile();

    expect(
      module.get<AiResearchKillSwitchService>(AiResearchKillSwitchService),
    ).toBeDefined();
    expect(
      module.get<NaturalLanguageSearchFilterService>(
        NaturalLanguageSearchFilterService,
      ),
    ).toBeDefined();
    expect(
      module.get<TargetCompanySuggestionService>(
        TargetCompanySuggestionService,
      ),
    ).toBeDefined();
    expect(
      module.get<RelationshipPathSuggestionService>(
        RelationshipPathSuggestionService,
      ),
    ).toBeDefined();
  });
});
