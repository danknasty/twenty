import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeStandardExternalEntityLinkViewFields = (
  args: Omit<
    CreateStandardViewFieldArgs<'externalEntityLink'>,
    'context'
  >,
): Record<string, FlatViewField> => {
  return {
    // system is the label identifier; it must hold the lowest position in non-widget views.
    allExternalEntityLinksSystem: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'externalEntityLink',
      context: {
        viewName: 'allExternalEntityLinks',
        viewFieldName: 'system',
        fieldName: 'system',
        position: 0,
        isVisible: true,
        size: 150,
      },
    }),
    allExternalEntityLinksExternalCollection:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'allExternalEntityLinks',
          viewFieldName: 'externalCollection',
          fieldName: 'externalCollection',
          position: 1,
          isVisible: true,
          size: 200,
        },
      }),
    allExternalEntityLinksExternalId: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'externalEntityLink',
      context: {
        viewName: 'allExternalEntityLinks',
        viewFieldName: 'externalId',
        fieldName: 'externalId',
        position: 2,
        isVisible: true,
        size: 200,
      },
    }),
    allExternalEntityLinksTwentyRecordId: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'externalEntityLink',
      context: {
        viewName: 'allExternalEntityLinks',
        viewFieldName: 'twentyRecordId',
        fieldName: 'twentyRecordId',
        position: 3,
        isVisible: true,
        size: 200,
      },
    }),
    allExternalEntityLinksSyncStatus: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'externalEntityLink',
      context: {
        viewName: 'allExternalEntityLinks',
        viewFieldName: 'syncStatus',
        fieldName: 'syncStatus',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
    allExternalEntityLinksCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'externalEntityLink',
      context: {
        viewName: 'allExternalEntityLinks',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 5,
        isVisible: true,
        size: 150,
      },
    }),
    externalEntityLinkRecordPageFieldsSystem:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'system',
          fieldName: 'system',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsExternalCollection:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'externalCollection',
          fieldName: 'externalCollection',
          position: 1,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsExternalId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'externalId',
          fieldName: 'externalId',
          position: 2,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsTwentyObjectUniversalIdentifier:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'twentyObjectUniversalIdentifier',
          fieldName: 'twentyObjectUniversalIdentifier',
          position: 3,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsTwentyRecordId:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'twentyRecordId',
          fieldName: 'twentyRecordId',
          position: 4,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsExternalNaturalKey:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'externalNaturalKey',
          fieldName: 'externalNaturalKey',
          position: 5,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsSourceVersion:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'sourceVersion',
          fieldName: 'sourceVersion',
          position: 6,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsSourceUpdatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'sourceUpdatedAt',
          fieldName: 'sourceUpdatedAt',
          position: 7,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsSourceHash:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'sourceHash',
          fieldName: 'sourceHash',
          position: 8,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsLastInboundSyncAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'lastInboundSyncAt',
          fieldName: 'lastInboundSyncAt',
          position: 9,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsLastOutboundSyncAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'lastOutboundSyncAt',
          fieldName: 'lastOutboundSyncAt',
          position: 10,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsSyncStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'syncStatus',
          fieldName: 'syncStatus',
          position: 11,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsConflictStatus:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'conflictStatus',
          fieldName: 'conflictStatus',
          position: 12,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsLastErrorCode:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'lastErrorCode',
          fieldName: 'lastErrorCode',
          position: 13,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsLastErrorAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'lastErrorAt',
          fieldName: 'lastErrorAt',
          position: 14,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsIsAuthoritativeLink:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'isAuthoritativeLink',
          fieldName: 'isAuthoritativeLink',
          position: 15,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsMetadata:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'metadata',
          fieldName: 'metadata',
          position: 16,
          isVisible: true,
          size: 200,
          viewFieldGroupName: 'general',
        },
      }),
    externalEntityLinkRecordPageFieldsCreatedAt:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'createdAt',
          fieldName: 'createdAt',
          position: 0,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
    externalEntityLinkRecordPageFieldsCreatedBy:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'externalEntityLink',
        context: {
          viewName: 'externalEntityLinkRecordPageFields',
          viewFieldName: 'createdBy',
          fieldName: 'createdBy',
          position: 1,
          isVisible: true,
          size: 150,
          viewFieldGroupName: 'system',
        },
      }),
  };
};
