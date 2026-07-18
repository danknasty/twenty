import { FeatureFlagKey } from 'twenty-shared/types';
import { type QueryRunner } from 'typeorm';

const tableName = 'featureFlag';

type SeedFeatureFlagsArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const seedFeatureFlags = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedFeatureFlagsArgs) => {
  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, ['key', 'workspaceId', 'value'])
    .orIgnore()
    .values([
      {
        key: FeatureFlagKey.IS_UNIQUE_INDEXES_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EMAIL_GROUP_ENABLED,
        workspaceId: workspaceId,
        value: true,
      },
      {
        key: FeatureFlagKey.IS_JUNCTION_RELATIONS_ENABLED,
        workspaceId: workspaceId,
        value: true,
      },
      {
        key: FeatureFlagKey.IS_SETTINGS_DISCOVERY_HERO_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      // Executive Search — all default-off for production go-live gates
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_SYNC_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_OUTBOUND_PUBLISH_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_DIRECTUS_INBOUND_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_DIRECTUS_OUTBOUND_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_CLIENT_PORTAL_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_AI_CANDIDATE_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_AUTO_CLIENT_SHARING_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_AUTO_STAGE_CHANGES_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_RECORDING_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
      {
        key: FeatureFlagKey.IS_EXECUTIVE_SEARCH_EXTERNAL_ENRICHMENT_ENABLED,
        workspaceId: workspaceId,
        value: false,
      },
    ])
    .execute();
};

type DeleteFeatureFlagsArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const deleteFeatureFlags = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: DeleteFeatureFlagsArgs) => {
  await queryRunner.manager
    .createQueryBuilder()
    .delete()
    .from(`${schemaName}.${tableName}`)
    .where(`"${tableName}"."workspaceId" = :workspaceId`, { workspaceId })
    .execute();
};
