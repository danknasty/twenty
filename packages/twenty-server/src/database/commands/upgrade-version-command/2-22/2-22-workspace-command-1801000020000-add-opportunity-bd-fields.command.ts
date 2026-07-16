import { Command } from 'nest-commander';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { findFlatEntityByUniversalIdentifier } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const OPPORTUNITY_UNIVERSAL_IDENTIFIER =
  STANDARD_OBJECTS.opportunity.universalIdentifier;

const BD_FIELD_UNIVERSAL_IDENTIFIERS = [
  STANDARD_OBJECTS.opportunity.fields.searchType.universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.expectedFeeFloor.universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.expectedFeeCeiling.universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.expectedTimeline.universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.decisionDate.universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.decisionCriteria.universalIdentifier,
];

@RegisteredWorkspaceCommand('2.22.0', 1801000020000)
@Command({
  name: 'upgrade:2-22:add-opportunity-bd-fields',
  description:
    'Add 6 BD-specific fields (searchType, expectedFeeFloor, expectedFeeCeiling, expectedTimeline, decisionDate, decisionCriteria) to the opportunity standard object for existing workspaces.',
})
export class AddOpportunityBdFieldsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
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

    const { flatObjectMetadataMaps, flatFieldMetadataMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatObjectMetadataMaps',
        'flatFieldMetadataMaps',
      ]);

    const opportunityObject =
      findFlatEntityByUniversalIdentifier<FlatObjectMetadata>({
        flatEntityMaps: flatObjectMetadataMaps,
        universalIdentifier: OPPORTUNITY_UNIVERSAL_IDENTIFIER,
      });

    if (!isDefined(opportunityObject)) {
      this.logger.log(
        `opportunity object not found for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    // Check which BD fields already exist
    const missingFieldUniversalIdentifiers: string[] = [];

    for (const universalIdentifier of BD_FIELD_UNIVERSAL_IDENTIFIERS) {
      const existingField =
        findFlatEntityByUniversalIdentifier<FlatFieldMetadata>({
          flatEntityMaps: flatFieldMetadataMaps,
          universalIdentifier,
        });

      if (!isDefined(existingField)) {
        missingFieldUniversalIdentifiers.push(universalIdentifier);
      }
    }

    if (missingFieldUniversalIdentifiers.length === 0) {
      this.logger.log(
        `All BD fields already present on opportunity for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would create ${missingFieldUniversalIdentifiers.length} BD field(s) on opportunity for workspace ${workspaceId}`,
      );

      return;
    }

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const { allFlatEntityMaps: standardAllFlatEntityMaps } =
      computeTwentyStandardApplicationAllFlatEntityMaps({
        now: new Date().toISOString(),
        workspaceId,
        twentyStandardApplicationId: twentyStandardFlatApplication.id,
      });

    const flatFieldMetadataToCreate: FlatFieldMetadata[] = [];

    for (const universalIdentifier of missingFieldUniversalIdentifiers) {
      const standardFlatFieldMetadata =
        standardAllFlatEntityMaps.flatFieldMetadataMaps.byUniversalIdentifier[
          universalIdentifier
        ];

      if (!isDefined(standardFlatFieldMetadata)) {
        this.logger.log(
          `Standard field definition not found for ${universalIdentifier}, skipping`,
        );

        continue;
      }

      flatFieldMetadataToCreate.push({
        ...standardFlatFieldMetadata,
        viewFieldIds: [],
        viewFieldUniversalIdentifiers: [],
      });
    }

    if (flatFieldMetadataToCreate.length === 0) {
      this.logger.log(
        `No standard field definitions found to create for workspace ${workspaceId}`,
      );

      return;
    }

    const validateAndBuildResult =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
        {
          allFlatEntityOperationByMetadataName: {
            fieldMetadata: {
              flatEntityToCreate: flatFieldMetadataToCreate,
              flatEntityToDelete: [],
              flatEntityToUpdate: [],
            },
          },
          workspaceId,
          isSystemBuild: true,
          applicationUniversalIdentifier:
            twentyStandardFlatApplication.universalIdentifier,
        },
      );

    if (validateAndBuildResult.status === 'fail') {
      this.logger.error(
        `Failed to add BD fields on opportunity for workspace ${workspaceId}:\n${JSON.stringify(
          validateAndBuildResult,
          null,
          2,
        )}`,
      );

      throw new Error(
        `Failed to add BD fields on opportunity for workspace ${workspaceId}`,
      );
    }

    this.logger.log(
      `Added ${flatFieldMetadataToCreate.length} BD field(s) on opportunity for workspace ${workspaceId}`,
    );
  }
}
