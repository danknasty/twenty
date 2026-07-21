import { Module } from '@nestjs/common';

import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';
import { BoardMatrixEvaluationService } from 'src/modules/executive-search/services/ai/board-matrix-evaluation.service';
import { SearchHealthAdvisoryService } from 'src/modules/executive-search/services/ai/search-health-advisory.service';

@Module({
  imports: [
    TwentyORMModule,
    FeatureFlagModule,
    FirewallModule,
  ],
  providers: [
    BoardMatrixEvaluationService,
    SearchHealthAdvisoryService,
  ],
  exports: [
    BoardMatrixEvaluationService,
    SearchHealthAdvisoryService,
  ],
})
export class BoardMatrixAiModule {}
