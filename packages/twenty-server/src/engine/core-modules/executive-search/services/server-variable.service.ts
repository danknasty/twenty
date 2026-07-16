/* @license Enterprise */

import { Injectable } from '@nestjs/common';

/**
 * Provides per-workspace server variable values for the executive-search module.
 *
 * CURRENT IMPLEMENTATION (PR3): In-memory store for the prototype phase.
 * The webhook HMAC secret, Directus API key, and Directus URL are stored
 * in an in-memory map keyed by workspaceId.
 *
 * TODO (PR4+): Replace this with real persistence using
 * ApplicationVariableEntity repository + SecretEncryptionService.
 * At that point the module must import TypeOrmModule.forFeature([ApplicationVariableEntity])
 * and SecretEncryptionModule.
 */
@Injectable()
export class ServerVariableService {
  private readonly secrets = new Map<string, Map<string, string>>();

  /**
   * Register a variable value for a workspace (used in tests and seeding).
   */
  setVariable(
    workspaceId: string,
    key: string,
    value: string,
  ): void {
    if (!this.secrets.has(workspaceId)) {
      this.secrets.set(workspaceId, new Map());
    }
    this.secrets.get(workspaceId)!.set(key, value);
  }

  async getWebhookSecret(workspaceId: string): Promise<string | null> {
    return this.getVariable(workspaceId, 'DIRECTUS_WEBHOOK_SECRET');
  }

  async getDirectusApiKey(workspaceId: string): Promise<string | null> {
    return this.getVariable(workspaceId, 'DIRECTUS_API_KEY');
  }

  async getDirectusUrl(workspaceId: string): Promise<string | null> {
    return this.getVariable(workspaceId, 'DIRECTUS_URL');
  }

  private async getVariable(
    workspaceId: string,
    key: string,
  ): Promise<string | null> {
    const wsVars = this.secrets.get(workspaceId);

    if (!wsVars) {
      return null;
    }

    return wsVars.get(key) ?? null;
  }
}
