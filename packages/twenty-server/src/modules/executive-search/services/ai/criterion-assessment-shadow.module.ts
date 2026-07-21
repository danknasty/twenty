import { Module } from '@nestjs/common';

import { ObjectMetadataRepositoryModule } from 'src/engine/object-metadata-repository/object-metadata-repository.module';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';
import { FirewallModule } from 'src/modules/executive-search/firewall/firewall.module';
import { CriterionAssessmentShadowService } from 'src/modules/executive-search/services/ai/criterion-assessment-shadow.service';

@Module({
  imports: [
    ObjectMetadataRepositoryModule.forFeature([]),
    TwentyORMModule,
    FeatureFlagModule,
    WorkspaceEventEmitterModule,
    FirewallModule,
  ],
  providers: [
    CriterionAssessmentShadowService,
  ],
  exports: [
    CriterionAssessmentShadowService,
  ],
})
export class CriterionAssessmentShadowModule {}
