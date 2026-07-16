import { Command } from 'nest-commander';
import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'twenty-shared/application';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined } from 'twenty-shared/utils';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import {
  getExistingOrStandardFlatEntityOrThrow,
  getStandardFlatEntitiesToCreateOrThrow,
} from 'src/database/commands/upgrade-version-command/2-10/utils/get-standard-flat-entities-to-create-or-throw.util';
import { buildNavigationCommandMenuItemOperationsOrThrow } from 'src/database/commands/upgrade-version-command/2-10/utils/build-navigation-command-menu-item-operations-or-throw.util';
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

const EXECUTIVE_SEARCH_OBJECT_UNIVERSAL_IDENTIFIERS = [
  STANDARD_OBJECTS.searchEngagementTerms.universalIdentifier,
  STANDARD_OBJECTS.searchAssignment.universalIdentifier,
  STANDARD_OBJECTS.assignmentTeamMember.universalIdentifier,
  STANDARD_OBJECTS.searchMilestone.universalIdentifier,
  STANDARD_OBJECTS.positionSpecification.universalIdentifier,
  STANDARD_OBJECTS.searchCriterion.universalIdentifier,
];

const buildExecutiveSearchFieldUniversalIdentifiers = (): string[] => [
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchEngagementTerms.fields),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchAssignment.fields),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.assignmentTeamMember.fields),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchMilestone.fields),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.positionSpecification.fields),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchCriterion.fields),
  // Inverse fields on existing objects
  STANDARD_OBJECTS.company.fields.searchAssignments.universalIdentifier,
  STANDARD_OBJECTS.company.fields.searchEngagementTerms.universalIdentifier,
  STANDARD_OBJECTS.workspaceMember.fields.assignmentTeamMemberships
    .universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.searchAssignments.universalIdentifier,
  STANDARD_OBJECTS.opportunity.fields.searchEngagementTerms
    .universalIdentifier,
  STANDARD_OBJECTS.workspaceMember.fields.approvedSearchEngagementTerms
    .universalIdentifier,
  STANDARD_OBJECTS.workspaceMember.fields.approvedPositionSpecifications
    .universalIdentifier,
];

const buildExecutiveSearchIndexUniversalIdentifiers = (): string[] => [
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchEngagementTerms.indexes),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchAssignment.indexes),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.assignmentTeamMember.indexes),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchMilestone.indexes),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.positionSpecification.indexes),
  ...getUniversalIdentifiers(STANDARD_OBJECTS.searchCriterion.indexes),
];

const buildExecutiveSearchViewUniversalIdentifiers = (): string[] => [
  STANDARD_OBJECTS.searchEngagementTerms.views.allSearchEngagementTerms
    .universalIdentifier,
  STANDARD_OBJECTS.searchEngagementTerms.views
    .searchEngagementTermsRecordPageFields.universalIdentifier,
  STANDARD_OBJECTS.searchAssignment.views.allSearchAssignments
    .universalIdentifier,
  STANDARD_OBJECTS.searchAssignment.views.byStatus.universalIdentifier,
  STANDARD_OBJECTS.searchAssignment.views.searchAssignmentRecordPageFields
    .universalIdentifier,
  STANDARD_OBJECTS.assignmentTeamMember.views
    .assignmentTeamMemberRecordPageFields.universalIdentifier,
  STANDARD_OBJECTS.searchMilestone.views.searchMilestoneRecordPageFields
    .universalIdentifier,
  STANDARD_OBJECTS.positionSpecification.views.allPositionSpecifications
    .universalIdentifier,
  STANDARD_OBJECTS.positionSpecification.views
    .positionSpecificationRecordPageFields.universalIdentifier,
  STANDARD_OBJECTS.searchCriterion.views.searchCriterionRecordPageFields
    .universalIdentifier,
];

const buildExecutiveSearchViewFieldGroupUniversalIdentifiers = (): string[] => [
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchEngagementTerms.views
      .searchEngagementTermsRecordPageFields.viewFieldGroups,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchAssignment.views.searchAssignmentRecordPageFields
      .viewFieldGroups,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.assignmentTeamMember.views
      .assignmentTeamMemberRecordPageFields.viewFieldGroups,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchMilestone.views.searchMilestoneRecordPageFields
      .viewFieldGroups,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.positionSpecification.views
      .positionSpecificationRecordPageFields.viewFieldGroups,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchCriterion.views.searchCriterionRecordPageFields
      .viewFieldGroups,
  ),
];

const buildExecutiveSearchViewFieldUniversalIdentifiers = (): string[] => [
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchEngagementTerms.views.allSearchEngagementTerms
      .viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchEngagementTerms.views
      .searchEngagementTermsRecordPageFields.viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchAssignment.views.allSearchAssignments.viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchAssignment.views.byStatus.viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchAssignment.views.searchAssignmentRecordPageFields
      .viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.assignmentTeamMember.views
      .assignmentTeamMemberRecordPageFields.viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchMilestone.views.searchMilestoneRecordPageFields
      .viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.positionSpecification.views.allPositionSpecifications
      .viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.positionSpecification.views
      .positionSpecificationRecordPageFields.viewFields,
  ),
  ...getUniversalIdentifiers(
    STANDARD_OBJECTS.searchCriterion.views.searchCriterionRecordPageFields
      .viewFields,
  ),
];

@RegisteredWorkspaceCommand('2.22.0', 1784198263714)
@Command({
  name: 'upgrade:2-22:sync-executive-search-standard-objects',
  description:
    'Create the executive search standard metadata in existing workspaces',
})
export class SyncExecutiveSearchStandardObjectsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
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
      flatCommandMenuItemMaps,
    } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
      'flatObjectMetadataMaps',
      'flatFieldMetadataMaps',
      'flatIndexMaps',
      'flatViewMaps',
      'flatViewFieldMaps',
      'flatViewFieldGroupMaps',
      'flatCommandMenuItemMaps',
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

    const executiveSearchObjectMetadatasForNavigation =
      EXECUTIVE_SEARCH_OBJECT_UNIVERSAL_IDENTIFIERS.map(
        (universalIdentifier) =>
          getExistingOrStandardFlatEntityOrThrow<FlatObjectMetadata>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatObjectMetadataMaps,
            existingFlatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier,
          }),
      ).filter((entity) =>
        isDefined(
          standardAllFlatEntityMaps.flatObjectMetadataMaps
            .byUniversalIdentifier[entity.universalIdentifier],
        ),
      );

    const navigationCommandMenuItemOperations =
      buildNavigationCommandMenuItemOperationsOrThrow({
        existingFlatCommandMenuItemMaps: flatCommandMenuItemMaps,
        objectMetadatasForNavigation:
          executiveSearchObjectMetadatasForNavigation,
        applicationId: twentyStandardFlatApplication.id,
        workspaceId,
        now,
        renamedCollisionObjectMetadatas: [],
      });

    const allFlatEntityOperationByMetadataName = {
      objectMetadata: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatObjectMetadata>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatObjectMetadataMaps,
            existingFlatEntityMaps: flatObjectMetadataMaps,
            universalIdentifiers:
              EXECUTIVE_SEARCH_OBJECT_UNIVERSAL_IDENTIFIERS,
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
              buildExecutiveSearchFieldUniversalIdentifiers(),
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
              buildExecutiveSearchIndexUniversalIdentifiers(),
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      view: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatView>({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
            existingFlatEntityMaps: flatViewMaps,
            universalIdentifiers:
              buildExecutiveSearchViewUniversalIdentifiers(),
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
              buildExecutiveSearchViewFieldGroupUniversalIdentifiers(),
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
              buildExecutiveSearchViewFieldUniversalIdentifiers(),
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      commandMenuItem: navigationCommandMenuItemOperations,
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
        `Executive search standard metadata already exists for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would apply ${totalOperationCount} executive search standard metadata operations for workspace ${workspaceId}`,
      );

      return;
    }

    const result =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
        {
          isSystemBuild: true,
          applicationUniversalIdentifier:
            TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
          workspaceId,
          allFlatEntityOperationByMetadataName,
        },
      );

    if (result.status === 'fail') {
      throw new Error(
        `Failed to create executive search standard objects for workspace ${workspaceId}: ${JSON.stringify(
          result,
          null,
          2,
        )}`,
      );
    }

    this.logger.log(
      `Applied ${totalOperationCount} executive search standard metadata operations for workspace ${workspaceId}`,
    );
  }
}
