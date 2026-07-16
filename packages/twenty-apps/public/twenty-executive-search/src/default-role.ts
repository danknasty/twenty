import {
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  defineApplicationRole,
} from 'twenty-sdk/define';

import { APP_DISPLAY_NAME } from 'src/constants/app-display-name';
import { DEFAULT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/constants/default-role-universal-identifier';
import { SEARCH_ENGAGEMENT_TERMS_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';

import {
  ASSIGNMENT_TEAM_MEMBER_OBJECT_UNIVERSAL_IDENTIFIER,
  POSITION_SPECIFICATION_OBJECT_UNIVERSAL_IDENTIFIER,
  SEARCH_ASSIGNMENT_OBJECT_UNIVERSAL_IDENTIFIER,
  SEARCH_CRITERION_OBJECT_UNIVERSAL_IDENTIFIER,
  SEARCH_ENGAGEMENT_TERMS_OBJECT_UNIVERSAL_IDENTIFIER,
  SEARCH_MILESTONE_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Raw UUIDs from STANDARD_OBJECTS (twenty-shared) for executive objects
// that do not yet exist in the published twenty-sdk/define.
// These are the stable universal identifiers pinned in the standard-object
// constant and will never change.
const EXECUTIVE_PROFILE_UID = 'd5d279c4-be50-4a44-896e-e64d63f2a7f6';
const EXECUTIVE_CAREER_EXPERIENCE_UID =
  '190293c9-19bb-4bce-a532-90f82606cee0';
const EXECUTIVE_EDUCATION_UID = 'bf6030cd-7ce5-4c11-bf81-974ff65fd4b1';
const EXECUTIVE_BOARD_SERVICE_UID = '30b0287e-6681-42c1-94f9-01ed0e06055b';
const EXECUTIVE_CAPABILITY_UID = '6dd2cb7c-9c30-47ed-bfb6-c8ccb33baaea';
const EXECUTIVE_LANGUAGE_UID = '2c749e10-ae76-4d9e-bed1-46630b4bf65e';
const EXECUTIVE_ARTIFACT_UID = '46f80f0a-d4b6-4bb8-92bc-4e5e30dbf999';
const EXECUTIVE_AWARD_UID = 'cc229997-5392-47cb-b8c6-093092b10821';
const EXECUTIVE_EXTERNAL_PROFILE_UID =
  '969bf0cb-9eef-4eee-a708-5e6f43443b2a';
const EXECUTIVE_SEARCH_PREFERENCE_UID =
  '304cabb0-42d9-4d78-a302-5106d73ed6bc';

// Phase 7 — research domain object UUIDs (from STANDARD_OBJECTS)
const CONFIDENTIALITY_RECORD_UID = '526d8232-bccb-42df-b5b6-e3a143dba557';
const CONFLICT_CHECK_UID = '84e9dfc7-cabe-47c9-915b-0c8a21dd0c7f';
const MARKET_MAP_UID = 'e8b87567-1e12-4434-b390-1962c05388d4';
const OFF_LIMITS_RESTRICTION_UID = 'e111382e-ffdd-4d96-ba02-10df8240fa76';
const RELATIONSHIP_EDGE_UID = 'e10e3d9f-8ee3-469a-af73-fbca7bb12f3c';
const RESEARCH_CANDIDATE_UID = '414f051b-9f66-474f-b12f-d4ce8be498d3';
const RESEARCH_STRATEGY_UID = '39b454ce-1c6f-4312-a003-43a82f19955a';
const TARGET_COMPANY_UID = 'e84ba25c-c010-4ed9-858d-c03639d604ad';

export default defineApplicationRole({
  universalIdentifier: DEFAULT_ROLE_UNIVERSAL_IDENTIFIER,

  label: `${APP_DISPLAY_NAME} default role`,
  description:
    'Least-privilege base role for the executive-search application. ' +
    'Grants read and update access to searchEngagementTerms, searchAssignment, ' +
    'assignmentTeamMember, and searchMilestone objects.',

  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  canUpdateAllSettings: false,
  canBeAssignedToAgents: false,
  canBeAssignedToUsers: false,
  canBeAssignedToApiKeys: false,

  objectPermissions: [
    {
      objectUniversalIdentifier: CONFIDENTIALITY_RECORD_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: CONFLICT_CHECK_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_PROFILE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_CAREER_EXPERIENCE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_EDUCATION_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_BOARD_SERVICE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_CAPABILITY_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_LANGUAGE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_ARTIFACT_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_AWARD_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_EXTERNAL_PROFILE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: EXECUTIVE_SEARCH_PREFERENCE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: MARKET_MAP_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: OFF_LIMITS_RESTRICTION_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: RELATIONSHIP_EDGE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: RESEARCH_CANDIDATE_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: RESEARCH_STRATEGY_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: TARGET_COMPANY_UID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier:
        SEARCH_ENGAGEMENT_TERMS_OBJECT_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ],
  fieldPermissions: [],
  permissionFlagUniversalIdentifiers: [],
});
