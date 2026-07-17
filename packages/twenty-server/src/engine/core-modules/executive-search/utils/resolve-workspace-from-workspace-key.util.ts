/* @license Enterprise */

import {
  ExecutiveSearchException,
  ExecutiveSearchExceptionCode,
} from 'src/engine/core-modules/executive-search/exceptions/executive-search.exceptions';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Resolve a workspace key (UUID) to a workspace ID.
 *
 * workspaceKey IS the workspace UUID (Twenty WorkspaceEntity.id).
 * For now, accept any valid UUID v4 and return it as-is.
 * Full workspace lookup (DB query) will be wired in a follow-up.
 *
 * @throws ExecutiveSearchException with WORKSPACE_KEY_UNRESOLVED if key is not a valid UUID v4.
 */
export async function resolveWorkspaceFromKey(
  workspaceKey: string,
): Promise<string> {
  if (!UUID_V4_REGEX.test(workspaceKey)) {
    throw new ExecutiveSearchException(
      `Workspace key "${workspaceKey}" is not a valid UUID v4`,
      ExecutiveSearchExceptionCode.WORKSPACE_KEY_UNRESOLVED,
    );
  }

  // In production this would look up the workspace in the DB.
  // For now, the UUID is the workspaceId.
  return workspaceKey;
}
