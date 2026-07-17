import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { AddSyncPrimitiveStandardObjectsCommand } from 'src/database/commands/upgrade-version-command/2-22/2-22-workspace-command-1784150000000-add-sync-primitive-standard-objects.command';
import { SyncClientStakeholderRoleStandardObjectsCommand } from 'src/database/commands/upgrade-version-command/2-22/2-22-workspace-command-1799000056000-create-client-stakeholder-role-standard-object.command';
import { AddOpportunityBdFieldsCommand } from 'src/database/commands/upgrade-version-command/2-22/2-22-workspace-command-1801000020000-add-opportunity-bd-fields.command';
import { CreateClientAccountProfileStandardObjectCommand } from 'src/database/commands/upgrade-version-command/2-22/2-22-workspace-command-1799000057000-create-client-account-profile-standard-object.command';
import { CreateSearchEngagementTermsStandardObjectCommand } from 'src/database/commands/upgrade-version-command/2-22/2-22-workspace-command-1810000000000-create-search-engagement-terms-standard-object.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';
import { WorkspaceMigrationRunnerModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity, FieldMetadataEntity]),
    ApplicationModule,
    WorkspaceCacheModule,
    WorkspaceIteratorModule,
    WorkspaceMigrationModule,
    WorkspaceMigrationRunnerModule,
  ],
  providers: [
    AddSyncPrimitiveStandardObjectsCommand,
    SyncClientStakeholderRoleStandardObjectsCommand,
    AddOpportunityBdFieldsCommand,
    CreateClientAccountProfileStandardObjectCommand,
    CreateSearchEngagementTermsStandardObjectCommand,
  ],
})
export class V2_22_UpgradeVersionCommandModule {}
