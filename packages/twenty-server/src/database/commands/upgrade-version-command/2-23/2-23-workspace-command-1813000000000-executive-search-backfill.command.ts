import { Command } from 'nest-commander';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { BackfillService } from 'src/modules/executive-search/migration/services/backfill.service';

@RegisteredWorkspaceCommand('2.23.0', 1813000000000)
@Command({
  name: 'upgrade:2-23:executive-search-backfill',
  description:
    'Backfill executive search data from Directus into Twenty — idempotent and resumable',
})
export class ExecutiveSearchBackfillCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly backfillService: BackfillService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    this.logger.log(
      `Starting executive search backfill for workspace ${workspaceId}${isDryRun ? ' [DRY RUN]' : ''}`,
    );

    const report = await this.backfillService.backfill(workspaceId, isDryRun);

    this.logger.log(
      `Backfill complete for workspace ${workspaceId}: ` +
        `creates=${report.creates} links=${report.links} ` +
        `conflicts=${report.conflicts} skips=${report.skips} ` +
        `errors=${report.errors} stageEvents=${report.stageEvents} ` +
        `crossRefs=${report.crossRefs}`,
    );
  }
}
