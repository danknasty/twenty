/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import { FeatureFlagKey } from 'twenty-shared/types';

import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';

@Injectable()
export class AiResearchKillSwitchService {
  private readonly logger = new Logger(AiResearchKillSwitchService.name);

  constructor(
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Checks the master toggle AND the per-capability toggle.
   * Returns true if the capability should proceed.
   * Logs deactivation when a kill switch is triggered.
   */
  async isCapabilityEnabled(
    capabilityFlag: FeatureFlagKey,
    workspaceId: string,
  ): Promise<boolean> {
    // Master toggle must be on
    const masterEnabled = await this.featureFlagService.isFeatureEnabled(
      FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_RESEARCH_ENABLED,
      workspaceId,
    );

    if (!masterEnabled) {
      this.logger.debug(
        `[AiResearchKillSwitch] Master toggle disabled for workspace ${workspaceId}. Capability: ${capabilityFlag}`,
      );

      return false;
    }

    // Per-capability toggle must be on
    const capabilityEnabled = await this.featureFlagService.isFeatureEnabled(
      capabilityFlag,
      workspaceId,
    );

    if (!capabilityEnabled) {
      this.logger.debug(
        `[AiResearchKillSwitch] Capability disabled for workspace ${workspaceId}: ${capabilityFlag}`,
      );

      return false;
    }

    return true;
  }
}
