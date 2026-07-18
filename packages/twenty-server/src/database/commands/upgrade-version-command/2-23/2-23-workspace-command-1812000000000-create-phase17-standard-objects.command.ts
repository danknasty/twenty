import { Command } from 'nest-commander';
import {
  STANDARD_OBJECTS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-shared/metadata';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { getStandardFlatEntitiesToCreateOrThrow } from 'src/database/commands/upgrade-version-command/2-10/utils/get-standard-flat-entities-to-create-or-throw.util';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { type FlatViewFieldGroup } from 'src/engine/metadata-modules/flat-view-field-group/types/flat-view-field-group.type';
import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import { type FlatPageLayout } from 'src/engine/metadata-modules/flat-page-layout/types/flat-page-layout.type';
import { type FlatPageLayoutTab } from 'src/engine/metadata-modules/flat-page-layout-tab/types/flat-page-layout-tab.type';
import { type FlatPageLayoutWidget } from 'src/engine/metadata-modules/flat-page-layout-widget/types/flat-page-layout-widget.type';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const PHASE17_OBJECT_NAMES = [
  'retentionActionLog',
  'externalIdentityMatchQueue',
] as const satisfies (keyof typeof STANDARD_OBJECTS)[];

const PHASE17_OBJECTS = PHASE17_OBJECT_NAMES.map(
  (name) => STANDARD_OBJECTS[name],
);

const PHASE17_OBJECT_UNIVERSAL_IDENTIFIERS = PHASE17_OBJECTS.map(
  (obj) => obj.universalIdentifier,
);

const PHASE17_FIELD_UNIVERSAL_IDENTIFIERS = PHASE17_OBJECTS.flatMap((obj) =>
  Object.values(obj.fields).map((f) => f.universalIdentifier),
);

const PHASE17_INDEX_UNIVERSAL_IDENTIFIERS = PHASE17_OBJECTS.flatMap((obj) =>
  Object.values(obj.indexes).map((i) => i.universalIdentifier),
);

const PHASE17_VIEW_UNIVERSAL_IDENTIFIERS = PHASE17_OBJECTS.flatMap((obj) =>
  Object.values(obj.views).map((v) => v.universalIdentifier),
);

const PHASE17_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS =
  PHASE17_OBJECTS.flatMap((obj) =>
    Object.values(obj.views).flatMap((v) =>
      Object.values(v.viewFieldGroups ?? {}).map(
        (vfg) => vfg.universalIdentifier,
      ),
    ),
  );

const PHASE17_VIEW_FIELD_UNIVERSAL_IDENTIFIERS = PHASE17_OBJECTS.flatMap(
  (obj) =>
    Object.values(obj.views).flatMap((v) =>
      Object.values(v.viewFields).map((vf) => vf.universalIdentifier),
    ),
);

const PHASE17_PAGE_LAYOUT_RECORD_PAGES = [
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.retentionActionLogRecordPage,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.externalIdentityMatchQueueRecordPage,
];

const PHASE17_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS =
  PHASE17_PAGE_LAYOUT_RECORD_PAGES.map((page) => page.universalIdentifier);

const PHASE17_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIERS =
  PHASE17_PAGE_LAYOUT_RECORD_PAGES.flatMap((page) =>
    Object.values(page.tabs).map((tab) => tab.universalIdentifier),
  );

const PHASE17_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS =
  PHASE17_PAGE_LAYOUT_RECORD_PAGES.flatMap((page) =>
    Object.values(page.tabs).flatMap((tab) =>
      Object.values(tab.widgets).map((widget) => widget.universalIdentifier),
    ),
  );

@RegisteredWorkspaceCommand('2.23.0', 1812000000000)
@Command({
  name: 'upgrade:2-23:create-phase17-standard-objects',
  description:
    'Create the Phase 17 standard objects (retentionActionLog, externalIdentityMatchQueue) in existing workspaces',
})
export class CreatePhase17StandardObjectsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
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

    this.logger.log(
      `Checking Phase 17 standard objects for workspace ${workspaceId}`,
    );

    const {
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
      flatIndexMaps,
      flatViewMaps,
      flatViewFieldMaps,
      flatViewFieldGroupMaps,
      flatPageLayoutMaps,
      flatPageLayoutTabMaps,
      flatPageLayoutWidgetMaps,
      flatCommandMenuItemMaps,
    } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
      'flatObjectMetadataMaps',
      'flatFieldMetadataMaps',
      'flatIndexMaps',
      'flatViewMaps',
      'flatViewFieldMaps',
      'flatViewFieldGroupMaps',
      'flatPageLayoutMaps',
      'flatPageLayoutTabMaps',
      'flatPageLayoutWidgetMaps',
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

    const objectMetadataToCreate =
      getStandardFlatEntitiesToCreateOrThrow<FlatObjectMetadata>({
        standardFlatEntityMaps:
          standardAllFlatEntityMaps.flatObjectMetadataMaps,
        existingFlatEntityMaps: flatObjectMetadataMaps,
        universalIdentifiers: PHASE17_OBJECT_UNIVERSAL_IDENTIFIERS,
      });

    if (objectMetadataToCreate.length === 0) {
      this.logger.log(
        `Phase 17 standard objects already exist for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    const allFlatEntityOperationByMetadataName = {
      objectMetadata: {
        flatEntityToCreate: objectMetadataToCreate,
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      fieldMetadata: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatFieldMetadata>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatFieldMetadataMaps,
            existingFlatEntityMaps: flatFieldMetadataMaps,
            universalIdentifiers: PHASE17_FIELD_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      index: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatIndexMetadata>({
            standardFlatEntityMaps: standardAllFlatEntityMaps.flatIndexMaps,
            existingFlatEntityMaps: flatIndexMaps,
            universalIdentifiers: PHASE17_INDEX_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      view: {
        flatEntityToCreate: getStandardFlatEntitiesToCreateOrThrow<FlatView>({
          standardFlatEntityMaps: standardAllFlatEntityMaps.flatViewMaps,
          existingFlatEntityMaps: flatViewMaps,
          universalIdentifiers: PHASE17_VIEW_UNIVERSAL_IDENTIFIERS,
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
            universalIdentifiers: PHASE17_VIEW_FIELD_GROUP_UNIVERSAL_IDENTIFIERS,
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
            universalIdentifiers: PHASE17_VIEW_FIELD_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      pageLayout: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatPageLayout>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatPageLayoutMaps,
            existingFlatEntityMaps: flatPageLayoutMaps,
            universalIdentifiers: PHASE17_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      pageLayoutTab: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatPageLayoutTab>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatPageLayoutTabMaps,
            existingFlatEntityMaps: flatPageLayoutTabMaps,
            universalIdentifiers: PHASE17_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      pageLayoutWidget: {
        flatEntityToCreate:
          getStandardFlatEntitiesToCreateOrThrow<FlatPageLayoutWidget>({
            standardFlatEntityMaps:
              standardAllFlatEntityMaps.flatPageLayoutWidgetMaps,
            existingFlatEntityMaps: flatPageLayoutWidgetMaps,
            universalIdentifiers:
              PHASE17_PAGE_LAYOUT_WIDGET_UNIVERSAL_IDENTIFIERS,
          }),
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
      commandMenuItem: {
        flatEntityToCreate: [],
        flatEntityToDelete: [],
        flatEntityToUpdate: [],
      },
    };

    const totalCreateCount = Object.values(
      allFlatEntityOperationByMetadataName,
    ).reduce(
      (total, operations) => total + operations.flatEntityToCreate.length,
      0,
    );

    if (totalCreateCount === 0) {
      this.logger.log(
        `Phase 17 standard objects already fully exist for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would create ${totalCreateCount} Phase 17 standard metadata entities (${objectMetadataToCreate.length} objects, ${allFlatEntityOperationByMetadataName.fieldMetadata.flatEntityToCreate.length} fields, ${allFlatEntityOperationByMetadataName.index.flatEntityToCreate.length} indexes, ${allFlatEntityOperationByMetadataName.view.flatEntityToCreate.length} views, ${allFlatEntityOperationByMetadataName.viewField.flatEntityToCreate.length} view fields) for workspace ${workspaceId}`,
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
      this.logger.error(
        `Failed to create Phase 17 standard objects:\n${JSON.stringify(validateAndBuildResult, null, 2)}`,
      );

      throw new Error(
        `Failed to create Phase 17 standard objects for workspace ${workspaceId}`,
      );
    }

    this.logger.log(
      `Successfully created ${totalCreateCount} Phase 17 standard metadata entities for workspace ${workspaceId}`,
    );
  }
}
