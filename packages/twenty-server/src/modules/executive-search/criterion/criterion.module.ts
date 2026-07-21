import { Module } from '@nestjs/common';

import { CriterionAssessmentKillSwitchService } from 'src/modules/executive-search/criterion/services/criterion-assessment-kill-switch.service';
import { CriterionShadowAssessmentService } from 'src/modules/executive-search/criterion/services/criterion-shadow-assessment.service';

@Module({
  providers: [
    CriterionAssessmentKillSwitchService,
    CriterionShadowAssessmentService,
  ],
  exports: [
    CriterionAssessmentKillSwitchService,
    CriterionShadowAssessmentService,
  ],
})
export class CriterionModule {}
