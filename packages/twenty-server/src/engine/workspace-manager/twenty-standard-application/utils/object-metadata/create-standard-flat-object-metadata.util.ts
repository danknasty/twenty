import { msg } from '@lingui/core/macro';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/twenty-standard-application/types/all-standard-object-name.type';
import { i18nLabel } from 'src/engine/workspace-manager/twenty-standard-application/utils/i18n-label.util';
import {
  type CreateStandardObjectArgs,
  createStandardObjectFlatMetadata,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/object-metadata/create-standard-object-flat-metadata.util';

export const STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME = {
  attachment: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'attachment'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'attachment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.attachment.universalIdentifier,
        nameSingular: 'attachment',
        namePlural: 'attachments',
        labelSingular: i18nLabel(msg`Attachment`),
        labelPlural: i18nLabel(msg`Attachments`),
        description: i18nLabel(msg`An attachment`),
        icon: 'IconFileImport',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  blocklist: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'blocklist'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'blocklist',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.blocklist.universalIdentifier,
        nameSingular: 'blocklist',
        namePlural: 'blocklists',
        labelSingular: i18nLabel(msg`Blocklist`),
        labelPlural: i18nLabel(msg`Blocklists`),
        description: i18nLabel(msg`Blocklist`),
        icon: 'IconForbid2',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarChannelEventAssociation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarChannelEventAssociation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarChannelEventAssociation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarChannelEventAssociation.universalIdentifier,
        nameSingular: 'calendarChannelEventAssociation',
        namePlural: 'calendarChannelEventAssociations',
        labelSingular: i18nLabel(msg`Calendar Channel Event Association`),
        labelPlural: i18nLabel(msg`Calendar Channel Event Associations`),
        description: i18nLabel(msg`Calendar Channel Event Associations`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarEventParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEventParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEventParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarEventParticipant.universalIdentifier,
        nameSingular: 'calendarEventParticipant',
        namePlural: 'calendarEventParticipants',
        labelSingular: i18nLabel(msg`Calendar event participant`),
        labelPlural: i18nLabel(msg`Calendar event participants`),
        description: i18nLabel(msg`Calendar event participants`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  calendarEvent: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEvent'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEvent',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        nameSingular: 'calendarEvent',
        namePlural: 'calendarEvents',
        labelSingular: i18nLabel(msg`Calendar event`),
        labelPlural: i18nLabel(msg`Calendar events`),
        description: i18nLabel(msg`Calendar events`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  callRecording: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'callRecording'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'callRecording',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.callRecording.universalIdentifier,
        nameSingular: 'callRecording',
        namePlural: 'callRecordings',
        labelSingular: i18nLabel(msg`Call Recording`),
        labelPlural: i18nLabel(msg`Call Recordings`),
        description: i18nLabel(msg`A recording of a meeting`),
        icon: 'IconVideo',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  inboundEventLedger: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'inboundEventLedger'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'inboundEventLedger',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.inboundEventLedger.universalIdentifier,
        nameSingular: 'inboundEventLedger',
        namePlural: 'inboundEventLedgers',
        labelSingular: i18nLabel(msg`Inbound Event Ledger`),
        labelPlural: i18nLabel(msg`Inbound Event Ledgers`),
        description: i18nLabel(msg`Ledger of inbound sync events`),
        icon: 'IconInboxArrowDown',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'eventId',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  outboundEventLedger: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'outboundEventLedger'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'outboundEventLedger',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.outboundEventLedger.universalIdentifier,
        nameSingular: 'outboundEventLedger',
        namePlural: 'outboundEventLedgers',
        labelSingular: i18nLabel(msg`Outbound Event Ledger`),
        labelPlural: i18nLabel(msg`Outbound Event Ledgers`),
        description: i18nLabel(msg`Ledger of outbound sync events`),
        icon: 'IconInboxArrowUp',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'eventId',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  company: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'company'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'company',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.company.universalIdentifier,
        nameSingular: 'company',
        namePlural: 'companies',
        labelSingular: i18nLabel(msg`Company`),
        labelPlural: i18nLabel(msg`Companies`),
        description: i18nLabel(msg`A company`),
        icon: 'IconBuildingSkyscraper',
        isSearchable: true,
        shortcut: 'C',
        duplicateCriteria: [['name'], ['domainNamePrimaryLinkUrl']],
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  confidentialityRecord: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'confidentialityRecord'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'confidentialityRecord',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.confidentialityRecord.universalIdentifier,
        nameSingular: 'confidentialityRecord',
        namePlural: 'confidentialityRecords',
        labelSingular: i18nLabel(msg`Confidentiality Record`),
        labelPlural: i18nLabel(msg`Confidentiality Records`),
        description: i18nLabel(
          msg`A confidentiality record such as an NDA or search confidentiality agreement`,
        ),
        icon: 'IconLock',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'summary',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  conflictCheck: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'conflictCheck'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'conflictCheck',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.conflictCheck.universalIdentifier,
        nameSingular: 'conflictCheck',
        namePlural: 'conflictChecks',
        labelSingular: i18nLabel(msg`Conflict Check`),
        labelPlural: i18nLabel(msg`Conflict Checks`),
        description: i18nLabel(
          msg`A check against off-limits restrictions for compliance`,
        ),
        icon: 'IconShieldCheck',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'summary',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  dashboard: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'dashboard'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'dashboard',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.dashboard.universalIdentifier,
        nameSingular: 'dashboard',
        namePlural: 'dashboards',
        labelSingular: i18nLabel(msg`Dashboard`),
        labelPlural: i18nLabel(msg`Dashboards`),
        description: i18nLabel(msg`A dashboard`),
        icon: 'IconLayoutDashboard',
        isSearchable: true,
        shortcut: 'D',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  externalEntityLink: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'externalEntityLink'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'externalEntityLink',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.externalEntityLink.universalIdentifier,
        nameSingular: 'externalEntityLink',
        namePlural: 'externalEntityLinks',
        labelSingular: i18nLabel(msg`External Entity Link`),
        labelPlural: i18nLabel(msg`External Entity Links`),
        description: i18nLabel(
          msg`Links between Twenty records and external entity records`,
        ),
        icon: 'IconLink',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'externalId',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  externalSyncCheckpoint: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'externalSyncCheckpoint'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'externalSyncCheckpoint',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.externalSyncCheckpoint.universalIdentifier,
        nameSingular: 'externalSyncCheckpoint',
        namePlural: 'externalSyncCheckpoints',
        labelSingular: i18nLabel(msg`External Sync Checkpoint`),
        labelPlural: i18nLabel(msg`External Sync Checkpoints`),
        description: i18nLabel(
          msg`Tracks the last synchronized position for each external system and entity`,
        ),
        icon: 'IconBookmark',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  externalSyncDLQ: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'externalSyncDLQ'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'externalSyncDLQ',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.externalSyncDLQ.universalIdentifier,
        nameSingular: 'externalSyncDLQ',
        namePlural: 'externalSyncDLQs',
        labelSingular: i18nLabel(msg`External Sync DLQ`),
        labelPlural: i18nLabel(msg`External Sync DLQs`),
        description: i18nLabel(
          msg`Dead-letter queue for failed external sync events`,
        ),
        icon: 'IconAlertTriangle',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  externalSyncInbox: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'externalSyncInbox'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'externalSyncInbox',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.externalSyncInbox.universalIdentifier,
        nameSingular: 'externalSyncInbox',
        namePlural: 'externalSyncInboxes',
        labelSingular: i18nLabel(msg`External Sync Inbox`),
        labelPlural: i18nLabel(msg`External Sync Inboxes`),
        description: i18nLabel(
          msg`Incoming external sync events to be processed`,
        ),
        icon: 'IconInbox',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  externalSyncOutbox: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'externalSyncOutbox'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'externalSyncOutbox',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.externalSyncOutbox.universalIdentifier,
        nameSingular: 'externalSyncOutbox',
        namePlural: 'externalSyncOutboxes',
        labelSingular: i18nLabel(msg`External Sync Outbox`),
        labelPlural: i18nLabel(msg`External Sync Outboxes`),
        description: i18nLabel(
          msg`Outgoing outbound sync events to be sent to external systems`,
        ),
        icon: 'IconSend',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workspaceEventOutbox: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workspaceEventOutbox'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workspaceEventOutbox',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workspaceEventOutbox.universalIdentifier,
        nameSingular: 'workspaceEventOutbox',
        namePlural: 'workspaceEventOutboxes',
        labelSingular: i18nLabel(msg`Workspace Event Outbox`),
        labelPlural: i18nLabel(msg`Workspace Event Outboxes`),
        description: i18nLabel(
          msg`Transactional outbox for workspace-scoped events`,
        ),
        icon: 'IconMailForward',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'eventName',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  externalSyncReconciliation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'externalSyncReconciliation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'externalSyncReconciliation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.externalSyncReconciliation.universalIdentifier,
        nameSingular: 'externalSyncReconciliation',
        namePlural: 'externalSyncReconciliations',
        labelSingular: i18nLabel(msg`External Sync Reconciliation`),
        labelPlural: i18nLabel(msg`External Sync Reconciliations`),
        description: i18nLabel(
          msg`Records the results of data reconciliation between Twenty and external systems`,
        ),
        icon: 'IconFileCheck',
        isSystem: true,
        isSearchable: false,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageCampaign: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageCampaign'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageCampaign',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageCampaign.universalIdentifier,
        nameSingular: 'messageCampaign',
        namePlural: 'messageCampaigns',
        labelSingular: i18nLabel(msg`Campaign`),
        labelPlural: i18nLabel(msg`Campaigns`),
        description: i18nLabel(
          msg`A bulk email send to an audience, with delivery stats`,
        ),
        icon: 'IconSend',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageList: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'messageList'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageList',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.messageList.universalIdentifier,
        nameSingular: 'messageList',
        namePlural: 'messageLists',
        labelSingular: i18nLabel(msg`List`),
        labelPlural: i18nLabel(msg`Lists`),
        description: i18nLabel(msg`A hand-picked audience of people`),
        icon: 'IconUsersGroup',
        isSystem: true,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageListMember: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageListMember'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageListMember',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageListMember.universalIdentifier,
        nameSingular: 'messageListMember',
        namePlural: 'messageListMembers',
        labelSingular: i18nLabel(msg`List Member`),
        labelPlural: i18nLabel(msg`List Members`),
        description: i18nLabel(msg`A person's membership in a list`),
        icon: 'IconUser',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageChannelMessageAssociation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannelMessageAssociation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannelMessageAssociation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannelMessageAssociation.universalIdentifier,
        nameSingular: 'messageChannelMessageAssociation',
        namePlural: 'messageChannelMessageAssociations',
        labelSingular: i18nLabel(msg`Message Channel Message Association`),
        labelPlural: i18nLabel(msg`Message Channel Message Associations`),
        description: i18nLabel(msg`Message Synced with a Message Channel`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageChannelMessageAssociationMessageFolder: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannelMessageAssociationMessageFolder'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannelMessageAssociationMessageFolder',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder
            .universalIdentifier,
        nameSingular: 'messageChannelMessageAssociationMessageFolder',
        namePlural: 'messageChannelMessageAssociationMessageFolders',
        labelSingular: i18nLabel(
          msg`Message Channel Message Association Message Folder`,
        ),
        labelPlural: i18nLabel(
          msg`Message Channel Message Association Message Folders`,
        ),
        description: i18nLabel(
          msg`Join table linking message channel message associations to message folders`,
        ),
        icon: 'IconFolder',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageParticipant.universalIdentifier,
        nameSingular: 'messageParticipant',
        namePlural: 'messageParticipants',
        labelSingular: i18nLabel(msg`Message Participant`),
        labelPlural: i18nLabel(msg`Message Participants`),
        description: i18nLabel(msg`Message Participants`),
        icon: 'IconUserCircle',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  messageThread: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageThread'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageThread',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.messageThread.universalIdentifier,
        nameSingular: 'messageThread',
        namePlural: 'messageThreads',
        labelSingular: i18nLabel(msg`Message Thread`),
        labelPlural: i18nLabel(msg`Message Threads`),
        description: i18nLabel(msg`Message Thread`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  message: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'message'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'message',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.message.universalIdentifier,
        nameSingular: 'message',
        namePlural: 'messages',
        labelSingular: i18nLabel(msg`Message`),
        labelPlural: i18nLabel(msg`Messages`),
        description: i18nLabel(msg`Message`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  note: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'note'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'note',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.note.universalIdentifier,
        nameSingular: 'note',
        namePlural: 'notes',
        labelSingular: i18nLabel(msg`Note`),
        labelPlural: i18nLabel(msg`Notes`),
        description: i18nLabel(msg`A note`),
        icon: 'IconNotes',
        isSearchable: true,
        shortcut: 'N',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  noteTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'noteTarget'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'noteTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.noteTarget.universalIdentifier,
        nameSingular: 'noteTarget',
        namePlural: 'noteTargets',
        labelSingular: i18nLabel(msg`Note Target`),
        labelPlural: i18nLabel(msg`Note Targets`),
        description: i18nLabel(msg`A note target`),
        icon: 'IconCheckbox',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  offLimitsRestriction: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'offLimitsRestriction'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'offLimitsRestriction',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.offLimitsRestriction.universalIdentifier,
        nameSingular: 'offLimitsRestriction',
        namePlural: 'offLimitsRestrictions',
        labelSingular: i18nLabel(msg`Off-Limits Restriction`),
        labelPlural: i18nLabel(msg`Off-Limits Restrictions`),
        description: i18nLabel(
          msg`An off-limits restriction governing search activity`,
        ),
        icon: 'IconForbid2',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'summary',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  opportunity: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'opportunity'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'opportunity',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.opportunity.universalIdentifier,
        nameSingular: 'opportunity',
        namePlural: 'opportunities',
        labelSingular: i18nLabel(msg`Opportunity`),
        labelPlural: i18nLabel(msg`Opportunities`),
        description: i18nLabel(msg`An opportunity`),
        icon: 'IconTargetArrow',
        isSearchable: true,
        shortcut: 'O',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  person: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'person'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'person',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.person.universalIdentifier,
        nameSingular: 'person',
        namePlural: 'people',
        labelSingular: i18nLabel(msg`Person`),
        labelPlural: i18nLabel(msg`People`),
        description: i18nLabel(msg`A person`),
        icon: 'IconUser',
        isSearchable: true,
        shortcut: 'P',
        duplicateCriteria: [
          ['nameFirstName', 'nameLastName'],
          ['linkedinLinkPrimaryLinkUrl'],
          ['emailsPrimaryEmail'],
        ],
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'avatarUrl',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  task: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'task'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'task',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.task.universalIdentifier,
        nameSingular: 'task',
        namePlural: 'tasks',
        labelSingular: i18nLabel(msg`Task`),
        labelPlural: i18nLabel(msg`Tasks`),
        description: i18nLabel(msg`A task`),
        icon: 'IconCheckbox',
        isSearchable: true,
        shortcut: 'T',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  taskTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'taskTarget'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'taskTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.taskTarget.universalIdentifier,
        nameSingular: 'taskTarget',
        namePlural: 'taskTargets',
        labelSingular: i18nLabel(msg`Task Target`),
        labelPlural: i18nLabel(msg`Task Targets`),
        description: i18nLabel(msg`A task target`),
        icon: 'IconCheckbox',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  timelineActivity: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'timelineActivity'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'timelineActivity',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.timelineActivity.universalIdentifier,
        nameSingular: 'timelineActivity',
        namePlural: 'timelineActivities',
        labelSingular: i18nLabel(msg`Timeline Activity`),
        labelPlural: i18nLabel(msg`Timeline Activities`),
        description: i18nLabel(
          msg`Aggregated / filtered event to be displayed on the timeline`,
        ),
        icon: 'IconTimelineEvent',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflow: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'workflow'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflow',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.workflow.universalIdentifier,
        nameSingular: 'workflow',
        namePlural: 'workflows',
        labelSingular: i18nLabel(msg`Workflow`),
        labelPlural: i18nLabel(msg`Workflows`),
        description: i18nLabel(msg`A workflow`),
        icon: 'IconSettingsAutomation',
        isSearchable: true,
        shortcut: 'W',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflowAutomatedTrigger: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workflowAutomatedTrigger'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowAutomatedTrigger',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workflowAutomatedTrigger.universalIdentifier,
        nameSingular: 'workflowAutomatedTrigger',
        namePlural: 'workflowAutomatedTriggers',
        labelSingular: i18nLabel(msg`Workflow Automated Trigger`),
        labelPlural: i18nLabel(msg`Workflow Automated Triggers`),
        description: i18nLabel(msg`A workflow automated trigger`),
        icon: 'IconSettingsAutomation',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflowRun: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'workflowRun'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowRun',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.workflowRun.universalIdentifier,
        nameSingular: 'workflowRun',
        namePlural: 'workflowRuns',
        labelSingular: i18nLabel(msg`Workflow Run`),
        labelPlural: i18nLabel(msg`Workflow Runs`),
        description: i18nLabel(msg`A workflow run`),
        icon: 'IconHistoryToggle',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workflowVersion: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workflowVersion'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowVersion',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        nameSingular: 'workflowVersion',
        namePlural: 'workflowVersions',
        labelSingular: i18nLabel(msg`Workflow Version`),
        labelPlural: i18nLabel(msg`Workflow Versions`),
        description: i18nLabel(msg`A workflow version`),
        icon: 'IconVersions',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  workspaceMember: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workspaceMember'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workspaceMember',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workspaceMember.universalIdentifier,
        nameSingular: 'workspaceMember',
        namePlural: 'workspaceMembers',
        labelSingular: i18nLabel(msg`Workspace Member`),
        labelPlural: i18nLabel(msg`Workspace Members`),
        description: i18nLabel(msg`A workspace member`),
        icon: 'IconUserCircle',
        isSystem: true,
        isSearchable: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'avatarUrl',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
executiveProfile: ({
clientStakeholderRole: ({
searchEngagementTerms: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
CreateStandardObjectArgs<'executiveProfile'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveProfile',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveProfile.universalIdentifier,
        nameSingular: 'executiveProfile',
        namePlural: 'executiveProfiles',
        labelSingular: i18nLabel(msg`Executive Profile`),
        labelPlural: i18nLabel(msg`Executive Profiles`),
        description: i18nLabel(msg`Executive profile for a person`),
        icon: 'IconUserCircle',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'headline',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveCareerExperience: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveCareerExperience'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveCareerExperience',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveCareerExperience.universalIdentifier,
        nameSingular: 'executiveCareerExperience',
        namePlural: 'executiveCareerExperiences',
        labelSingular: i18nLabel(msg`Career Experience`),
        labelPlural: i18nLabel(msg`Career Experiences`),
        description: i18nLabel(msg`A career experience entry`),
        icon: 'IconBriefcase',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveEducation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveEducation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveEducation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveEducation.universalIdentifier,
        nameSingular: 'executiveEducation',
        namePlural: 'executiveEducations',
        labelSingular: i18nLabel(msg`Education`),
        labelPlural: i18nLabel(msg`Educations`),
        description: i18nLabel(msg`An education entry`),
        icon: 'IconSchool',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'institution',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveBoardService: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveBoardService'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveBoardService',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveBoardService.universalIdentifier,
        nameSingular: 'executiveBoardService',
        namePlural: 'executiveBoardServices',
        labelSingular: i18nLabel(msg`Board Service`),
        labelPlural: i18nLabel(msg`Board Services`),
        description: i18nLabel(msg`A board service record`),
        icon: 'IconBuilding',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'companyName',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveCapability: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveCapability'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveCapability',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveCapability.universalIdentifier,
        nameSingular: 'executiveCapability',
        namePlural: 'executiveCapabilities',
        labelSingular: i18nLabel(msg`Capability`),
        labelPlural: i18nLabel(msg`Capabilities`),
        description: i18nLabel(msg`A skill or capability`),
        icon: 'IconStar',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveLanguage: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveLanguage'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveLanguage',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveLanguage.universalIdentifier,
        nameSingular: 'executiveLanguage',
        namePlural: 'executiveLanguages',
        labelSingular: i18nLabel(msg`Language`),
        labelPlural: i18nLabel(msg`Languages`),
        description: i18nLabel(msg`A language proficiency`),
        icon: 'IconLanguage',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'language',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveArtifact: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveArtifact'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveArtifact',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveArtifact.universalIdentifier,
        nameSingular: 'executiveArtifact',
        namePlural: 'executiveArtifacts',
        labelSingular: i18nLabel(msg`Artifact`),
        labelPlural: i18nLabel(msg`Artifacts`),
        description: i18nLabel(msg`An uploaded artifact or document`),
        icon: 'IconFile',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveAward: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveAward'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveAward',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveAward.universalIdentifier,
        nameSingular: 'executiveAward',
        namePlural: 'executiveAwards',
        labelSingular: i18nLabel(msg`Award`),
        labelPlural: i18nLabel(msg`Awards`),
        description: i18nLabel(msg`An award or recognition`),
        icon: 'IconTrophy',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveExternalProfile: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveExternalProfile'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveExternalProfile',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveExternalProfile.universalIdentifier,
        nameSingular: 'executiveExternalProfile',
        namePlural: 'executiveExternalProfiles',
        labelSingular: i18nLabel(msg`External Profile`),
        labelPlural: i18nLabel(msg`External Profiles`),
        description: i18nLabel(msg`An external platform profile`),
        icon: 'IconLink',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'url',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  executiveSearchPreference: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'executiveSearchPreference'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'executiveSearchPreference',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.executiveSearchPreference.universalIdentifier,
        nameSingular: 'executiveSearchPreference',
        namePlural: 'executiveSearchPreferences',
        labelSingular: i18nLabel(msg`Search Preference`),
        labelPlural: i18nLabel(msg`Search Preferences`),
        description: i18nLabel(msg`Search and notification preferences`),
        icon: 'IconSearch',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'boardTypes',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
clientAccountProfile: ({
outboxEvent: ({
relationshipEdge: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
CreateStandardObjectArgs<'clientAccountProfile'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'clientAccountProfile',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.clientAccountProfile.universalIdentifier,
        nameSingular: 'clientAccountProfile',
        namePlural: 'clientAccountProfiles',
        labelSingular: i18nLabel(msg`Client Account Profile`),
        labelPlural: i18nLabel(msg`Client Account Profiles`),
        description: i18nLabel(
          msg`Client account profile with engagement metadata`,
        ),
        icon: 'IconBriefcase',
        isSystem: true,
        isUICreatable: true,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
CreateStandardObjectArgs<'outboxEvent'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'outboxEvent',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.outboxEvent.universalIdentifier,
        nameSingular: 'outboxEvent',
        namePlural: 'outboxEvents',
        labelSingular: i18nLabel(msg`Outbox Event`),
        labelPlural: i18nLabel(msg`Outbox Events`),
        description: i18nLabel(msg`An outbox event for sync`),
        icon: 'IconMailForward',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'eventType',
CreateStandardObjectArgs<'relationshipEdge'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'relationshipEdge',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.relationshipEdge.universalIdentifier,
        nameSingular: 'relationshipEdge',
        namePlural: 'relationshipEdges',
        labelSingular: i18nLabel(msg`Relationship Edge`),
        labelPlural: i18nLabel(msg`Relationship Edges`),
        description: i18nLabel(
          msg`A relationship-graph edge between people or companies`,
        ),
        icon: 'IconShare2',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'summary',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
clientStakeholderRole: ({
deadLetterRecord: ({
marketMap: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
CreateStandardObjectArgs<'clientStakeholderRole'>,
CreateStandardObjectArgs<'clientStakeholderRole'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'clientStakeholderRole',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.clientStakeholderRole.universalIdentifier,
        nameSingular: 'clientStakeholderRole',
        namePlural: 'clientStakeholderRoles',
        labelSingular: i18nLabel(msg`Client Stakeholder Role`),
        labelPlural: i18nLabel(msg`Client Stakeholder Roles`),
        description: i18nLabel(
msg`Role of a stakeholder at a client company`,
        ),
        icon: 'IconUserStar',
        isSystem: true,
        isUICreatable: true,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
CreateStandardObjectArgs<'deadLetterRecord'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'deadLetterRecord',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.deadLetterRecord.universalIdentifier,
        nameSingular: 'deadLetterRecord',
        namePlural: 'deadLetterRecords',
        labelSingular: i18nLabel(msg`Dead Letter Record`),
        labelPlural: i18nLabel(msg`Dead Letter Records`),
        description: i18nLabel(msg`A dead-letter record for failed sync events`),
        icon: 'IconAlertTriangle',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'eventId',
msg`A stakeholder role at a client organization`,
        ),
        icon: 'IconUser',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
reconciliationRun: ({
searchEngagementTerms: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
CreateStandardObjectArgs<'reconciliationRun'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'reconciliationRun',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.reconciliationRun.universalIdentifier,
        nameSingular: 'reconciliationRun',
        namePlural: 'reconciliationRuns',
        labelSingular: i18nLabel(msg`Reconciliation Run`),
        labelPlural: i18nLabel(msg`Reconciliation Runs`),
        description: i18nLabel(msg`A reconciliation run`),
        icon: 'IconChecklist',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'id',
CreateStandardObjectArgs<'searchEngagementTerms'>,
CreateStandardObjectArgs<'searchEngagementTerms'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'searchEngagementTerms',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.searchEngagementTerms.universalIdentifier,
        nameSingular: 'searchEngagementTerms',
namePlural: 'searchEngagementTerms',
        labelSingular: i18nLabel(msg`Search Engagement Terms`),
        labelPlural: i18nLabel(msg`Search Engagement Terms`),
        description: i18nLabel(
          msg`Terms, fee structure, exclusivity, and payment schedule for a retained-search engagement`,
        ),
        icon: 'IconFileDollar',
        isSearchable: false,
namePlural: 'searchEngagementsTerms',
        labelSingular: i18nLabel(msg`Search Engagement Terms`),
        labelPlural: i18nLabel(msg`Search Engagement Terms`),
        description: i18nLabel(msg`Terms of engagement for a search`),
        icon: 'IconFileContract',
        isSystem: true,
        isAuditLogged: false,
CreateStandardObjectArgs<'marketMap'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'marketMap',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.marketMap.universalIdentifier,
        nameSingular: 'marketMap',
        namePlural: 'marketMaps',
        labelSingular: i18nLabel(msg`Market Map`),
        labelPlural: i18nLabel(msg`Market Maps`),
        description: i18nLabel(msg`A market map for a research strategy`),
        icon: 'IconMap',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
reconciliationFinding: ({
clientAccountProfile: ({
searchAssignment: ({
researchCandidate: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
CreateStandardObjectArgs<'reconciliationFinding'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'reconciliationFinding',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.reconciliationFinding.universalIdentifier,
        nameSingular: 'reconciliationFinding',
        namePlural: 'reconciliationFindings',
        labelSingular: i18nLabel(msg`Reconciliation Finding`),
        labelPlural: i18nLabel(msg`Reconciliation Findings`),
        description: i18nLabel(msg`A finding from a reconciliation run`),
        icon: 'IconSearch',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'findingType',
CreateStandardObjectArgs<'clientAccountProfile'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'clientAccountProfile',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.clientAccountProfile.universalIdentifier,
        nameSingular: 'clientAccountProfile',
        namePlural: 'clientAccountProfiles',
        labelSingular: i18nLabel(msg`Client Account Profile`),
        labelPlural: i18nLabel(msg`Client Account Profiles`),
        description: i18nLabel(msg`A client account profile`),
        icon: 'IconBuilding',
        isSearchable: false,
CreateStandardObjectArgs<'searchAssignment'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'searchAssignment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.searchAssignment.universalIdentifier,
        nameSingular: 'searchAssignment',
        namePlural: 'searchAssignments',
        labelSingular: i18nLabel(msg`Search Assignment`),
        labelPlural: i18nLabel(msg`Search Assignments`),
        description: i18nLabel(msg`An executive search assignment`),
        icon: 'IconTargetArrow',
        isSystem: true,
        isAuditLogged: false,
CreateStandardObjectArgs<'researchCandidate'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'researchCandidate',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.researchCandidate.universalIdentifier,
        nameSingular: 'researchCandidate',
        namePlural: 'researchCandidates',
        labelSingular: i18nLabel(msg`Research Candidate`),
        labelPlural: i18nLabel(msg`Research Candidates`),
        description: i18nLabel(msg`A candidate identified through research`),
        icon: 'IconUserSearch',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'currentTitle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  researchStrategy: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'researchStrategy'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'researchStrategy',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.researchStrategy.universalIdentifier,
        nameSingular: 'researchStrategy',
        namePlural: 'researchStrategies',
        labelSingular: i18nLabel(msg`Research Strategy`),
        labelPlural: i18nLabel(msg`Research Strategies`),
        description: i18nLabel(msg`A research plan for a search assignment`),
        icon: 'IconChartDots',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
assignmentTeamMember: ({
targetCompany: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
CreateStandardObjectArgs<'assignmentTeamMember'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'assignmentTeamMember',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.assignmentTeamMember.universalIdentifier,
        nameSingular: 'assignmentTeamMember',
        namePlural: 'assignmentTeamMembers',
        labelSingular: i18nLabel(msg`Assignment Team Member`),
        labelPlural: i18nLabel(msg`Assignment Team Members`),
        description: i18nLabel(msg`A team member on a search assignment`),
        icon: 'IconUsers',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'role',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  searchMilestone: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'searchMilestone'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'searchMilestone',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.searchMilestone.universalIdentifier,
        nameSingular: 'searchMilestone',
        namePlural: 'searchMilestones',
        labelSingular: i18nLabel(msg`Search Milestone`),
        labelPlural: i18nLabel(msg`Search Milestones`),
        description: i18nLabel(msg`A milestone on a search assignment`),
        icon: 'IconFlag3',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  positionSpecification: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'positionSpecification'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'positionSpecification',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.positionSpecification.universalIdentifier,
        nameSingular: 'positionSpecification',
        namePlural: 'positionSpecifications',
        labelSingular: i18nLabel(msg`Position Specification`),
        labelPlural: i18nLabel(msg`Position Specifications`),
        description: i18nLabel(msg`A position specification for a search`),
        icon: 'IconClipboardList',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  searchCriterion: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'searchCriterion'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'searchCriterion',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.searchCriterion.universalIdentifier,
        nameSingular: 'searchCriterion',
        namePlural: 'searchCriteria',
        labelSingular: i18nLabel(msg`Search Criterion`),
        labelPlural: i18nLabel(msg`Search Criteria`),
        description: i18nLabel(msg`A search criterion for a position`),
        icon: 'IconChecklist',
        isSystem: true,
        isAuditLogged: false,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
CreateStandardObjectArgs<'targetCompany'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'targetCompany',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.targetCompany.universalIdentifier,
        nameSingular: 'targetCompany',
        namePlural: 'targetCompanies',
        labelSingular: i18nLabel(msg`Target Company`),
        labelPlural: i18nLabel(msg`Target Companies`),
        description: i18nLabel(msg`A company targeted in a market map`),
        icon: 'IconBuildingSkyscraper',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'companyName',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
  aiPromptTemplate: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    twentyStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'aiPromptTemplate'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'aiPromptTemplate',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.aiPromptTemplate.universalIdentifier,
        nameSingular: 'aiPromptTemplate',
        namePlural: 'aiPromptTemplates',
        labelSingular: i18nLabel(msg`AI Prompt Template`),
        labelPlural: i18nLabel(msg`AI Prompt Templates`),
        description: i18nLabel(msg`An AI prompt template for governed model interactions`),
        icon: 'IconMessage',
        isSystem: true,
        isUICreatable: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      twentyStandardApplicationId,
      now,
    }),
} satisfies {
  [P in AllStandardObjectName]: (
    args: Omit<CreateStandardObjectArgs<P>, 'context' | 'objectName'>,
  ) => FlatObjectMetadata;
};
