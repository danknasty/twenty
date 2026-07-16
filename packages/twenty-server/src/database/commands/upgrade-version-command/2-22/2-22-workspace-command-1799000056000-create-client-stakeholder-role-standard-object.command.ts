import { Command } from 'nest-commander';
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'twenty-shared/application';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import {
  getExistingOrStandardFlatEntityOrThrow,
  getStandardFlatEntitiesToCreateOrThrow,
} from 'src/database/commands/upgrade-version-command/2-10/utils/get-standard-flat-entities-to-create-or-throw.util';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const getUniversalIdentifiers = (
  entitiesByName: Record<string, { universalIdentifier: string }>,
): string[] =>
  Object.values(entitiesByName).map((entity) => entity.universalIdentifier);

const CLIENT_STAKEHOLDER_ROLE_OBJECT_METADATA_UNIVERSAL_IDENTIFIERS = [
  STANDARD_OBJECTS.clientStakeholderRole.universalIdentifier,
];

const CLIENT_STAKEHOLDER_ROLE_FIELD_METADATA_UNIVERSAL_IDENTIFIERS =
  getUniversalIdentifiers(STANDARD_OBJECTS.clientStakeholderRole.fields);

const CLIENT_STAKEHOLDER_ROLE_INDEX_UNIVERSAL_IDENTIFIERS =
  getUniversalIdentifiers(STANDARD_OBJECTS.clientStakeholderRole.indexes);

const CLIENT_STAKEHOLDER_ROLE_VIEW_UNIVERSAL_IDENTIFIERS = [
  STANDARD_OBJECTS.clientStakeholderRole.views.allClientStakeholderRoles
    .universalIdentifier,
  STANDARD_OBJECTS.clientStakeholderRole.views
    .clientStakeholderRoleRecordPageFields.universalIdentifier,
];

const CLIENT_STAKEHOLDER_ROLE_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS =
  getUniversalIdentifiers(
    STANDARD_OBJECTS.clientStakeholderRole.views
      .clientStakeholderRoleRecordPageFields.viewFieldGroups,
  );

const CLIENT_STAKEHOLDER_ROLE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = [
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.clientStakeholderRole.views.allClientStakeholderRoles
      .viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.clientStakeholderRole.views
      .clientStakeholderRoleRecordPageFields.viewFields,
  ),
];

@RegisteredWorkspaceCommand('2.22.0', 1799000056000)
@Command({
  name: 'upgrade:2-22:create-client-stakeholder-role-standard-object',
  description:
    'Create the ClientStakeholderRole standard metadata in existing workspaces',
})
export class SyncClientStakeholderRoleStandardObjectsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    const {
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
      flatIndexMaps,
      flatViewMaps,
      flatViewFieldMaps,
      flatViewFieldGroupMaps,
    } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
      'flatObjectMetadataMaps',
      'flatFieldMetadataMaps',
      'flatIndexMaps',
      'flatViewMaps',
      'flatViewFieldMaps',
      'flatViewFieldGroupMaps',
    ]);

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const now = new Date().toISOString();

    const { allFlatEntityMaps: standardAllFlatEntityMaps } =
      computeTwentyStandardApplicationAllFlatEntityMaps({
        now,
        workspaceId,
        twentyStandardApplicationId: twentyStandardFlatApplication.id,
      });

    const allFlatEntityOperationByMetadataName = {
      objectMetadata: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatObjectMetadata>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatObjectMetadataMaps,
            existingFlatEntityMaps: flatObjectMetadataMaps,
            universalIdentifiers:
              CLIENT_STAKEHOLDER_ROLE_OBJECT_METADATA_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      fieldMetadata: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatFieldMetadata>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatFieldMetadataMaps,
            existingFlatEntityMaps: flatFieldMetadataMaps,
            universalIdentifiers:
              CLIENT_STAKEHOLDER_ROLE_FIELD_METADATA_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      index: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatIndexMetadata>({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatIndexMaps,
            existingFlatEntityMaps: flatIndexMaps,
            universalIdentifiers:
              CLIENT_STAKEHOLDER_ROLE_INDEX_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      view: {
        flatEntityToCreate: getStandardFlatEntitiesToCreateOrThrow<FlatView>({
          standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
          existingFlatEntityMaps: flatViewMaps,
          universalIdentifiers:
            CLIENT_STAKEHOLDER_ROLE_VIEW_UNIVERSAL_IDENTIFIERS,
        }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      viewFieldGroup: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatViewFieldGroup>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatViewFieldGroupMaps,
            existingFlatEntityMaps: flatViewFieldGroupMaps,
            universalIdentifiers:
              CLIENT_STAKEHOLDER_ROLE_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      viewField: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatViewField>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatViewFieldMaps,
            existingFlatEntityMaps: flatViewFieldMaps,
            universalIdentifiers:
              CLIENT_STAKEHOLDER_ROLE_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
    };

    const totalOperationCount = Object.values(
      allFlatEntityOperationByMetadataName,
    ).reduce(
      (total, operations) =>
        total +
        operations.flatEntityToCreate.length +
        operations.flatEntityToUpdate.length,
      0,
    );

    if (totalOperationCount === 0) {
      this.logger.log(
        `ClientStakeholderRole standard metadata already exists for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would apply ${totalOperationCount} ClientStakeholderRole standard metadata operations for workspace ${workspaceId}`,
      );

      return;
    }

    const validateAndBuildResult =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
        {
          isSystemBuild: true,
          applicationUniversalIdentifier:
            twentyStandardFlatApplication.universalIdentifier,
          workspaceId,
          allFlatEntityOperationByMetadataName,
        },
      );

    if (validateAndBuildResult.status === 'fail') {
      throw new Error(
        `Failed to create ClientStakeholderRole standard objects for workspace ${workspaceId}: ${JSON.stringify(
          validateAndBuildResult,
          null,
          2,
        )}`,
      );
    }

    this.logger.log(
      `Applied ${totalOperationCount} ClientStakeholderRole standard metadata operations for workspace ${workspaceId}`,
    );
  }
}
