import { Injectable, Logger } from '@nestjs/common';

/**
 * Per-capability kill switch for AI criterion assessment.
 *
 * Each capability has an independent kill switch. When triggered, the
 * capability returns no results, logs the deactivation, and does not
 * affect any in-flight candidacy, stage, or client decision.
 */
@Injectable()
export class CriterionAssessmentKillSwitchService {
  private readonly logger = new Logger(CriterionAssessmentKillSwitchService.name);

  /**
   * In-memory kill switch registry keyed by capability name.
   * In production this would be backed by a persistent store,
   * but for the shadow mode implementation an in-memory map
   * suffices — the feature flag IS_EXECUTIVE_SEARCH_AI_CRITERION_ENABLED
   * provides the master gate.
   */
  private readonly killSwitches = new Map<string, boolean>();

  /**
   * Activate the kill switch for a specific capability.
   * Once activated, the capability will return no results.
   */
  activate(capability: string): void {
    this.killSwitches.set(capability, true);
    this.logger.warn(
      `Kill switch ACTIVATED for capability "${capability}". ` +
        `All criterion assessment results for this capability are suppressed.`,
    );
  }

  /**
   * Deactivate the kill switch for a specific capability,
   * restoring normal operation.
   */
  deactivate(capability: string): void {
    this.killSwitches.set(capability, false);
    this.logger.log(
      `Kill switch DEACTIVATED for capability "${capability}". ` +
        `Normal operation restored.`,
    );
  }

  /**
   * Check whether the kill switch is active for the given capability.
   * Returns true if the kill switch has been activated, false otherwise.
   */
  isActive(capability: string): boolean {
    return this.killSwitches.get(capability) === true;
  }

  /**
   * Get the set of capabilities that currently have an active kill switch.
   */
  getActiveCapabilities(): string[] {
    const active: string[] = [];

    for (const [capability, isActive] of this.killSwitches) {
      if (isActive) {
        active.push(capability);
      }
    }

    return active;
  }

  /**
   * Reset all kill switches (for testing or emergency recovery).
   */
  resetAll(): void {
    this.killSwitches.clear();
    this.logger.warn('All kill switches have been reset.');
  }
}
