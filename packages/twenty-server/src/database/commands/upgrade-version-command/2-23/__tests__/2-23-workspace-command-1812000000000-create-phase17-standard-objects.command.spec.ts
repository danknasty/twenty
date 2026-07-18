import { CreatePhase17StandardObjectsCommand } from 'src/database/commands/upgrade-version-command/2-23/2-23-workspace-command-1812000000000-create-phase17-standard-objects.command';
import { getStandardFlatEntitiesToCreateOrThrow } from 'src/database/commands/upgrade-version-command/2-10/utils/get-standard-flat-entities-to-create-or-throw.util';
import { type ApplicationService } from 'src/engine/core-modules/application/application.service';
import { type WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { type WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

jest.mock(
  'src/database/commands/upgrade-version-command/2-10/utils/get-standard-flat-entities-to-create-or-throw.util',
);
jest.mock(
  'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant',
);

const getStandardFlatEntitiesToCreateOrThrowMock =
  getStandardFlatEntitiesToCreateOrThrow as unknown as jest.Mock;
const computeTwentyStandardApplicationAllFlatEntityMapsMock =
  computeTwentyStandardApplicationAllFlatEntityMaps as unknown as jest.Mock;

const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';

describe('CreatePhase17StandardObjectsCommand', () => {
  let command: CreatePhase17StandardObjectsCommand;
  let getOrRecomputeMock: jest.Mock;
  let findApplicationMock: jest.Mock;
  let validateBuildAndRunMock: jest.Mock;
  let loggerLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    getOrRecomputeMock = jest.fn();
    findApplicationMock = jest.fn();
    validateBuildAndRunMock = jest.fn();

    // Default: no existing metadata (empty maps) + empty standard maps.
    getOrRecomputeMock.mockResolvedValue({
      flatObjectMetadataMaps: { byUniversalIdentifier: {} },
      flatFieldMetadataMaps: { byUniversalIdentifier: {} },
      flatIndexMaps: { byUniversalIdentifier: {} },
      flatViewMaps: { byUniversalIdentifier: {} },
      flatViewFieldMaps: { byUniversalIdentifier: {} },
      flatViewFieldGroupMaps: { byUniversalIdentifier: {} },
      flatPageLayoutMaps: { byUniversalIdentifier: {} },
      flatPageLayoutTabMaps: { byUniversalIdentifier: {} },
      flatPageLayoutWidgetMaps: { byUniversalIdentifier: {} },
      flatCommandMenuItemMaps: { byUniversalIdentifier: {} },
    });

    computeTwentyStandardApplicationAllFlatEntityMapsMock.mockReturnValue({
      allFlatEntityMaps: {
        flatObjectMetadataMaps: { byUniversalIdentifier: {} },
        flatFieldMetadataMaps: { byUniversalIdentifier: {} },
        flatIndexMaps: { byUniversalIdentifier: {} },
        flatViewMaps: { byUniversalIdentifier: {} },
        flatViewFieldMaps: { byUniversalIdentifier: {} },
        flatViewFieldGroupMaps: { byUniversalIdentifier: {} },
        flatPageLayoutMaps: { byUniversalIdentifier: {} },
        flatPageLayoutTabMaps: { byUniversalIdentifier: {} },
        flatPageLayoutWidgetMaps: { byUniversalIdentifier: {} },
      },
    });

    findApplicationMock.mockResolvedValue({
      twentyStandardFlatApplication: {
        id: 'app-1',
        universalIdentifier: 'app-uid',
      },
    });

    const workspaceIteratorService = {} as WorkspaceIteratorService;
    const applicationService = {
      findWorkspaceTwentyStandardAndCustomApplicationOrThrow:
        findApplicationMock,
    } as unknown as ApplicationService;
    const workspaceCacheService = {
      getOrRecompute: getOrRecomputeMock,
    } as unknown as WorkspaceCacheService;
    const workspaceMigrationValidateBuildAndRunService = {
      validateBuildAndRunWorkspaceMigration: validateBuildAndRunMock,
    } as unknown as WorkspaceMigrationValidateBuildAndRunService;

    command = new CreatePhase17StandardObjectsCommand(
      workspaceIteratorService,
      applicationService,
      workspaceCacheService,
      workspaceMigrationValidateBuildAndRunService,
    );

    loggerLogSpy = jest.spyOn(command['logger'], 'log').mockImplementation();
  });

  const runOnWorkspace = (dryRun = false) =>
    command.runOnWorkspace({
      workspaceId: WORKSPACE_ID,
      options: { dryRun },
      index: 0,
      total: 1,
    } as never);

  it('is a no-op (and does not validate/build) when the objects already exist', async () => {
    // getStandardFlatEntitiesToCreateOrThrow returns [] for every metadata type.
    getStandardFlatEntitiesToCreateOrThrowMock.mockReturnValue([]);

    await runOnWorkspace();

    expect(validateBuildAndRunMock).not.toHaveBeenCalled();
  });

  it('logs a dry-run summary and does not apply anything when dryRun is set', async () => {
    // Metadata is missing → there is work to do.
    getStandardFlatEntitiesToCreateOrThrowMock.mockReturnValue([
      { universalIdentifier: 'some-uid' },
    ]);

    await runOnWorkspace(true);

    expect(validateBuildAndRunMock).not.toHaveBeenCalled();
    expect(loggerLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DRY RUN]'),
    );
  });

  it('applies the metadata via the migration service when objects are missing', async () => {
    getStandardFlatEntitiesToCreateOrThrowMock.mockReturnValue([
      { universalIdentifier: 'some-uid' },
    ]);
    validateBuildAndRunMock.mockResolvedValue({ status: 'success' });

    await runOnWorkspace(false);

    expect(validateBuildAndRunMock).toHaveBeenCalledTimes(1);
    expect(validateBuildAndRunMock).toHaveBeenCalledWith(
      expect.objectContaining({
        isSystemBuild: true,
        workspaceId: WORKSPACE_ID,
        applicationUniversalIdentifier: 'app-uid',
      }),
    );
  });

  it('throws when the migration build reports a failure', async () => {
    getStandardFlatEntitiesToCreateOrThrowMock.mockReturnValue([
      { universalIdentifier: 'some-uid' },
    ]);
    validateBuildAndRunMock.mockResolvedValue({ status: 'fail' });

    await expect(runOnWorkspace(false)).rejects.toThrow(
      `Failed to create Phase 17 standard objects for workspace ${WORKSPACE_ID}`,
    );
  });
});
