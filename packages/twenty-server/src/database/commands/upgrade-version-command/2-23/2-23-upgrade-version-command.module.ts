import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { AddCandidacyStandardObjectsCommand } from 'src/database/commands/upgrade-version-command/2-23/2-23-workspace-command-1802000000000-add-candidacy-standard-objects.command';
import { SyncClientCrmStandardObjectsCommand } from 'src/database/commands/upgrade-version-command/2-23/2-23-workspace-command-1784193573815-sync-client-crm-standard-objects.command';
import { CreatePhase17StandardObjectsCommand } from 'src/database/commands/upgrade-version-command/2-23/2-23-workspace-command-1812000000000-create-phase17-standard-objects.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { WorkspaceMetadataVersionModule } from 'src/engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';
import { WorkspaceMigrationRunnerModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module';

@Module({
  imports: [
    ApplicationModule,
    TypeOrmModule.forFeature([FieldMetadataEntity]),
    WorkspaceCacheModule,
    WorkspaceIteratorModule,
    WorkspaceMetadataVersionModule,
    WorkspaceMigrationModule,
    WorkspaceMigrationRunnerModule,
  ],
  providers: [
    AddCandidacyStandardObjectsCommand,
    SyncClientCrmStandardObjectsCommand,
    CreatePhase17StandardObjectsCommand,
  ],
})
export class V2_23_UpgradeVersionCommandModule {}
